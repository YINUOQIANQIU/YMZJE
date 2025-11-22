# Vercel Postgres 数据库设置指南

本指南将详细说明如何在 Vercel 中创建 Postgres 数据库并完成部署。

## 步骤 1: 在 Vercel 中创建 Postgres 数据库

### 1.1 登录 Vercel 控制台

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录（或创建账号）

### 1.2 进入项目

1. 在 Dashboard 中找到您的项目
2. 点击项目名称进入项目详情页

### 1.3 创建 Postgres 数据库

1. 在项目页面，点击顶部菜单栏的 **"Storage"** 标签
2. 如果还没有数据库，会显示 "Create Database" 按钮
3. 点击 **"Create Database"** 或 **"Add"** 按钮
4. 选择 **"Postgres"** 数据库类型
5. 选择数据库区域（推荐选择离您最近的区域，如 `Southeast Asia (Singapore)`）
6. 输入数据库名称（可选，默认会生成）
7. 点击 **"Create"** 创建数据库

### 1.4 等待数据库创建完成

- 创建过程通常需要 1-2 分钟
- 创建完成后，您会看到数据库连接信息

## 步骤 2: 验证环境变量

### 2.1 检查自动设置的环境变量

Vercel 会自动为您的项目设置以下环境变量：

- `POSTGRES_URL` - 连接池 URL（推荐使用）
- `POSTGRES_PRISMA_URL` - Prisma 格式 URL
- `POSTGRES_URL_NON_POOLING` - 非连接池 URL

### 2.2 查看环境变量

1. 在项目页面，点击 **"Settings"** 标签
2. 点击左侧菜单的 **"Environment Variables"**
3. 您应该能看到上述三个环境变量已自动添加

**注意**：这些环境变量会自动注入到所有部署环境中（Production、Preview、Development）

## 步骤 3: 部署代码

### 3.1 确保代码已提交到 GitHub

```bash
# 检查当前状态
git status

# 添加所有更改
git add .

# 提交更改
git commit -m "适配 PostgreSQL 数据库"

# 推送到 GitHub
git push origin main
```

### 3.2 Vercel 自动部署

1. Vercel 会自动检测到 GitHub 推送
2. 自动开始构建和部署
3. 您可以在 Vercel Dashboard 的 **"Deployments"** 标签中查看部署进度

### 3.3 查看部署日志

1. 点击正在部署的构建
2. 查看 **"Build Logs"** 和 **"Function Logs"**
3. 应该能看到：
   - `✅ 成功连接到 PostgreSQL 数据库`
   - `数据库类型: PostgreSQL`
   - 所有表创建成功的日志

## 步骤 4: 验证部署

### 4.1 检查函数日志

1. 在 Vercel 项目页面，点击 **"Functions"** 标签
2. 点击 `api/index.js` 函数
3. 查看 **"Logs"** 标签
4. 应该看到数据库连接成功的消息

### 4.2 测试 API

访问您的 Vercel 部署 URL，测试 API 是否正常工作：

```
https://your-project-name.vercel.app/api/...
```

### 4.3 检查数据库表

如果一切正常，数据库表应该已经自动创建。您可以通过以下方式验证：

1. 在 Vercel 项目页面，点击 **"Storage"** 标签
2. 点击您的 Postgres 数据库
3. 使用 Vercel 提供的数据库管理界面查看表

## 步骤 5: 手动触发部署（如果需要）

如果自动部署没有触发，可以手动触发：

### 方法 1: 通过 Vercel Dashboard

1. 在项目页面，点击 **"Deployments"** 标签
2. 点击右上角的 **"Redeploy"** 按钮
3. 选择最新的提交
4. 点击 **"Redeploy"**

### 方法 2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI（如果还没有）
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## 常见问题排查

### 问题 1: 数据库连接失败

**症状**：日志显示 "数据库连接错误"

**解决方案**：
1. 检查环境变量是否正确设置
2. 确认数据库已创建完成
3. 检查网络连接

### 问题 2: 表创建失败

**症状**：日志显示 "创建表错误"

**解决方案**：
1. 查看详细错误信息
2. 某些 SQL 语法可能需要手动调整
3. 检查 PostgreSQL 版本兼容性

### 问题 3: 环境变量未找到

**症状**：代码无法找到 `POSTGRES_URL`

**解决方案**：
1. 确认数据库已创建
2. 检查 Settings → Environment Variables
3. 重新部署项目

### 问题 4: 函数大小仍然超过 300MB

**解决方案**：
1. 确保 `.gitignore` 和 `.vercelignore` 已正确配置
2. 从 Git 中移除大文件（参考之前的指南）
3. 重新推送代码

## 验证清单

部署完成后，请确认：

- [ ] Postgres 数据库已创建
- [ ] 环境变量已自动设置
- [ ] 代码已推送到 GitHub
- [ ] Vercel 部署成功
- [ ] 日志显示 "成功连接到 PostgreSQL 数据库"
- [ ] 所有表创建成功
- [ ] API 可以正常访问

## 下一步

部署成功后：

1. ✅ 测试所有功能
2. ✅ 验证数据操作正常
3. ✅ 监控函数日志
4. ✅ 如有需要，迁移现有数据

## 需要帮助？

如果遇到问题：

1. 查看 Vercel 部署日志
2. 检查函数日志
3. 参考 `POSTGRES_MIGRATION.md` 文档
4. 查看 Vercel 官方文档：https://vercel.com/docs/storage/vercel-postgres

