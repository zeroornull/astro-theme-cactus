# 构建阶段
FROM node:lts-slim AS build
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@latest --no-cache

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile --prefer-offline --no-audit

# 复制源代码并构建
COPY . .
RUN pnpm build && pnpm postbuild

# 运行时阶段
FROM nginx:alpine-slim AS runtime

# 设置 Nginx 配置
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 以非 root 用户运行
USER nginx