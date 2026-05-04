#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "正在安装依赖..."
npm install

echo "正在生成 Prisma Client..."
npm run db:generate

echo "正在执行数据库迁移..."
npm run db:migrate

echo "正在初始化默认数据..."
npm run db:seed

echo "正在构建前后端..."
npm run build

echo "构建完成，正在启动生产服务..."
npm run start
