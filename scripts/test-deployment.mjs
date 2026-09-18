import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("static routes retain custom 404 handling without an SPA fallback", () => {
	const nginx = read("nginx/my-app.conf");
	assert.match(nginx, /try_files \$uri \$uri\/ =404;/);
	assert.match(nginx, /error_page 404 \/404\.html;/);
	assert.match(nginx, /location = \/404\.html\s*\{[^}]*internal;/);
	assert.match(
		read("Dockerfile"),
		/COPY \.\/nginx\/my-app\.conf \/etc\/nginx\/conf\.d\/default\.conf/,
	);
	assert.equal(existsSync(new URL("../nginx/nginx.conf", import.meta.url)), false);
});

test("Docker excludes local state and secrets but retains the environment example", () => {
	const patterns = new Set(read(".dockerignore").split(/\r?\n/));
	for (const path of [
		"**/node_modules",
		"dist",
		".astro",
		".git",
		".omx",
		".env",
		".env.*",
		"*.pem",
	]) {
		assert.ok(patterns.has(path), `missing Docker exclusion: ${path}`);
	}
	assert.ok(patterns.has("!.example.env"));
});

test("Docker and CI share a pinned pnpm version and Node major", () => {
	const docker = read("Dockerfile");
	const ci = read(".github/workflows/ci.yml");
	const version = docker.match(/pnpm@(\d+\.\d+\.\d+)/)?.[1];
	assert.ok(version);
	assert.match(ci, new RegExp(`version: ["']?${version.replaceAll(".", "\\.")}["']?\\s`));
	assert.match(docker, /FROM node:22-bookworm-slim AS build/);
	assert.match(ci, /node-version: 22/);
	assert.equal(read(".nvmrc").trim(), "22");
	assert.doesNotMatch(docker, /pnpm@latest|node:lts/);
	assert.match(docker, /pnpm install --frozen-lockfile/);
	assert.doesNotMatch(docker, /pnpm build && pnpm postbuild/);
});

test("image publication depends on reusable CI at the same revision", () => {
	const workflow = read(".github/workflows/build_and_push_dockerhub.yml");
	assert.match(read(".github/workflows/ci.yml"), /\n {2}workflow_call:/);
	assert.match(workflow, /quality-check:\s*\n\s*uses: \.\/\.github\/workflows\/ci\.yml/);
	assert.match(workflow, /build-and-push:\s*\n\s*needs: quality-check/);
	assert.match(read(".github/workflows/ci.yml"), /node --test scripts\/test-deployment\.mjs/);
});

test("QEMU uses shared platform input before Buildx, including single ARM targets", () => {
	const workflow = read(".github/workflows/build_and_push_dockerhub.yml");
	assert.match(workflow, /env:\s*\n\s*PLATFORMS: \$\{\{ inputs.platforms \|\| 'linux\/amd64' \}\}/);
	assert.match(workflow, /if: env.PLATFORMS != 'linux\/amd64'/);
	assert.match(workflow, /platforms: \$\{\{ env.PLATFORMS \}\}/);
	assert.ok(
		workflow.indexOf("docker/setup-qemu-action") < workflow.indexOf("docker/setup-buildx-action"),
	);
	assert.doesNotMatch(workflow, /MULTI_PLATFORM/);
});

test("fork configuration contains no blanket suppression or obsolete config copy", () => {
	assert.doesNotMatch(read("astro.config.ts"), /@ts-ignore/);
	assert.doesNotMatch(read("src/site.config.ts"), /\/\/ export const siteConfig/);
	assert.doesNotMatch(read("Dockerfile"), /【错误】|【正确】/);
});

test("CI and image publication use action majors verified to support Node 24", () => {
	// These majors declare runs.using: node24 in their upstream action.yml.
	const expectedMajors = new Map([
		["actions/checkout", "v6"],
		["actions/setup-node", "v6"],
		["pnpm/action-setup", "v5"],
		["docker/login-action", "v4"],
		["docker/setup-qemu-action", "v4"],
		["docker/setup-buildx-action", "v4"],
		["docker/build-push-action", "v7"],
	]);
	const seen = new Set();
	for (const file of ["ci.yml", "build_and_push_dockerhub.yml"]) {
		const workflow = read(`.github/workflows/${file}`);
		for (const [, action, version] of workflow.matchAll(/uses:\s*([\w-]+\/[\w-]+)@(\S+)/g)) {
			assert.ok(expectedMajors.has(action), `verify the runtime of new action ${action}`);
			assert.equal(version, expectedMajors.get(action), `${file}: ${action}`);
			seen.add(action);
		}
	}
	assert.equal(seen.size, expectedMajors.size);
});
