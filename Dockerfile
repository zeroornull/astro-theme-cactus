# Build with the same Node major and pnpm version as CI.
FROM node:22-bookworm-slim AS build
WORKDIR /app

RUN npm install -g pnpm@10.34.5

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# pnpm runs the postbuild script to generate the Pagefind index.
RUN pnpm build

FROM nginx:alpine-slim AS runtime
COPY ./nginx/my-app.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html
EXPOSE 80
