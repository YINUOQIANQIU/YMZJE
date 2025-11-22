# 自动设置指南 - 无需手动配置

本指南将帮助您设置一个完全自动化的部署方案，只需上传代码到 GitHub 即可使用。

## 方案选择

### 方案 1: 使用 Supabase（推荐，完全免费）⭐

**优势**：
- ✅ 完全免费（有免费额度）
- ✅ 无需在 Vercel 手动创建数据库
- ✅ 可以通过代码自动配置
- ✅ 提供 PostgreSQL 数据库
- ✅ 提供 REST API 和实时功能

**设置步骤**：

1. **注册 Supabase 账号**（免费）
   - 访问 https://supabase.com
   - 使用 GitHub 账号注册

2. **创建新项目**
   - 点击 "New Project"
   - 输入项目名称
   - 设置数据库密码（记住这个密码！）
   - 选择区域（推荐：Southeast Asia）
   - 点击 "Create new project"

3. **获取连接信息**
   - 项目创建后，进入 "Settings" → "API"
   - 复制以下信息：
     - `Project URL` → 设置为 `SUPABASE_URL`
     - `anon public` key → 设置为 `SUPABASE_ANON_KEY`
   - 进入 "Settings" → "Database"
   - 复制 "Connection string" → 设置为 `SUPABASE_DB_URL`
     - 格式：`postgresql://postgres.[project-ref]:[password]@[host]:5432/postgres`

4. **在 Vercel 中设置环境变量**
   - 进入 Vercel 项目 → Settings → Environment Variables
   - 添加以下变量：
     ```
     SUPABASE_URL=https://xxxxx.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     SUPABASE_DB_URL=postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres
     ```
   - 或者直接在代码中设置（不推荐，安全性较低）

5. **部署代码**
   - 代码会自动检测 Supabase 配置
   - 自动连接到数据库
   - 首次部署时会提示创建表（见下方）

### 方案 2: 使用 JSON 文件存储（最简单，但功能有限）

**优势**：
- ✅ 完全免费
- ✅ 无需任何外部服务
- ✅ 数据存储在代码仓库中

**限制**：
- ⚠️ 不适合大量数据
- ⚠️ 并发写入可能有问题
- ⚠️ 需要 Git 来同步数据

**实现方式**：已包含在代码中，如果没有配置数据库，会自动使用 JSON 文件。

## 自动初始化数据库表

### 使用 Supabase

1. **方法 1：通过 Supabase Dashboard（推荐）**
   - 登录 Supabase Dashboard
   - 进入 "SQL Editor"
   - 复制 `server_modules/supabase-init.sql` 中的 SQL（如果存在）
   - 或使用下面提供的 SQL
   - 执行 SQL 创建表

2. **方法 2：通过代码自动创建（开发中）**
   - 代码会在首次运行时尝试创建表
   - 需要 Supabase Service Role Key（有安全风险，不推荐）

### 提供的 SQL 脚本

创建文件 `server_modules/supabase-init.sql`，包含所有表结构。

## 环境变量配置

### 在 Vercel 中配置

1. 进入项目 → Settings → Environment Variables
2. 添加以下变量：

**Supabase 配置**：
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres
```

**或者使用 Vercel Postgres**（如果已创建）：
```
POSTGRES_URL=postgresql://...
```

### 在代码中配置（仅用于测试）

创建 `.env.local` 文件（不要提交到 Git）：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DB_URL=postgresql://postgres.xxx:password@db.xxx.supabase.co:5432/postgres
```

## 一键部署脚本

创建 `setup.sh` 脚本，自动完成所有设置（可选）：

```bash
#!/bin/bash
echo "🚀 开始自动设置..."

# 检查环境变量
if [ -z "$SUPABASE_URL" ]; then
    echo "⚠️ 请先设置 SUPABASE_URL 环境变量"
    exit 1
fi

# 运行初始化
node server_modules/init-database.js

echo "✅ 设置完成！"
```

## 推荐的完整流程

### 第一次部署

1. ✅ 注册 Supabase 账号
2. ✅ 创建 Supabase 项目
3. ✅ 获取连接信息
4. ✅ 在 Vercel 设置环境变量
5. ✅ 推送代码到 GitHub
6. ✅ Vercel 自动部署
7. ✅ 在 Supabase SQL Editor 执行建表 SQL
8. ✅ 完成！

### 后续部署

1. ✅ 推送代码到 GitHub
2. ✅ Vercel 自动部署
3. ✅ 完成！

## 故障排查

### Supabase 连接失败

1. 检查环境变量是否正确
2. 检查 Supabase 项目是否激活
3. 检查数据库密码是否正确

### 表未创建

1. 手动在 Supabase SQL Editor 执行建表 SQL
2. 或使用 Supabase Dashboard 的表创建界面

### 环境变量未生效

1. 重新部署项目
2. 检查环境变量作用域（Production/Preview/Development）

## 安全提示

⚠️ **重要**：
- 不要将 Supabase 密码提交到 Git
- 使用环境变量存储敏感信息
- `SUPABASE_ANON_KEY` 可以公开（有 Row Level Security 保护）
- `SUPABASE_DB_URL` 包含密码，必须保密

## 免费额度

### Supabase 免费版
- ✅ 500MB 数据库空间
- ✅ 2GB 带宽/月
- ✅ 50,000 月活跃用户
- ✅ 足够小型项目使用

### Vercel 免费版
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 足够使用

## 总结

使用 Supabase 方案：
- ✅ 完全免费
- ✅ 只需注册账号和设置环境变量
- ✅ 无需在 Vercel 手动创建数据库
- ✅ 代码自动适配
- ✅ 一次设置，永久使用

只需：
1. 注册 Supabase（5分钟）
2. 设置环境变量（2分钟）
3. 推送代码（自动部署）

就这么简单！🎉

