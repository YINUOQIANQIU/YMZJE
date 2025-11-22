# PostgreSQL 迁移指南

本指南将帮助您将项目从 SQLite 迁移到 PostgreSQL（Vercel Postgres）。

## 为什么需要迁移？

- **Vercel 不支持 SQLite**：Vercel Serverless Functions 使用只读文件系统
- **PostgreSQL 是生产级数据库**：更强大、更可靠
- **Vercel 原生支持**：Vercel Postgres 与 Vercel 平台完美集成

## 已完成的适配

✅ 已创建数据库适配器，自动支持 SQLite 和 PostgreSQL
✅ 已创建 SQL 转换工具，自动转换 SQLite SQL 到 PostgreSQL
✅ 已更新数据库代码，兼容两种数据库

## 步骤 1: 在 Vercel 中创建 Postgres 数据库

1. 登录 Vercel 控制台
2. 进入您的项目
3. 点击 "Storage" 标签
4. 点击 "Create Database"
5. 选择 "Postgres"
6. 选择区域（推荐选择离您最近的区域）
7. 点击 "Create"

## 步骤 2: 获取数据库连接字符串

创建数据库后，Vercel 会自动设置以下环境变量：

- `POSTGRES_URL` - 连接池 URL（推荐使用）
- `POSTGRES_PRISMA_URL` - Prisma 格式 URL
- `POSTGRES_URL_NON_POOLING` - 非连接池 URL

这些环境变量会自动注入到您的 Serverless Functions 中。

## 步骤 3: 配置本地开发环境（可选）

如果您想在本地也使用 PostgreSQL：

1. 安装 PostgreSQL（或使用 Docker）
2. 创建本地数据库
3. 在 `.env.local` 文件中添加：

```env
POSTGRES_URL=postgresql://username:password@localhost:5432/database_name
```

或者继续使用 SQLite 进行本地开发（代码会自动检测）。

## 步骤 4: 部署和初始化

1. 将代码推送到 GitHub
2. Vercel 会自动部署
3. 数据库表会自动创建（首次部署时）

## 步骤 5: 迁移现有数据（如果有）

如果您有现有的 SQLite 数据需要迁移：

### 方法 1: 使用 SQL 导出/导入

```bash
# 1. 从 SQLite 导出数据
sqlite3 moyu_zhixue.db .dump > data.sql

# 2. 转换 SQL（手动或使用工具）
# 需要将 SQLite 语法转换为 PostgreSQL 语法

# 3. 导入到 PostgreSQL
psql $POSTGRES_URL < data.sql
```

### 方法 2: 使用迁移脚本

创建一个 Node.js 脚本：

```javascript
const sqlite3 = require('sqlite3');
const { Pool } = require('pg');

// 连接 SQLite
const sqliteDb = new sqlite3.Database('moyu_zhixue.db');

// 连接 PostgreSQL
const pgPool = new Pool({
  connectionString: process.env.POSTGRES_URL
});

// 迁移数据...
```

## SQL 语法差异

### 已自动处理的差异

✅ `INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`
✅ `DATETIME` → `TIMESTAMP`
✅ `BOOLEAN DEFAULT 1` → `BOOLEAN DEFAULT true`
✅ `PRAGMA table_info` → `information_schema.columns`

### 需要注意的差异

1. **字符串连接**：
   - SQLite: `||`
   - PostgreSQL: `||` (相同) 或 `CONCAT()`

2. **日期函数**：
   - SQLite: `datetime('now')`
   - PostgreSQL: `NOW()` 或 `CURRENT_TIMESTAMP`

3. **LIMIT/OFFSET**：
   - 两者语法相同

4. **INSERT 返回 ID**：
   - SQLite: `this.lastID`
   - PostgreSQL: `RETURNING id` (已自动处理)

## 验证迁移

部署后，检查日志：

1. 应该看到：`✅ 成功连接到 PostgreSQL 数据库`
2. 应该看到：`数据库类型: PostgreSQL`
3. 所有表应该成功创建

## 故障排查

### 连接失败

1. 检查环境变量是否正确设置
2. 检查 Vercel 项目设置中的环境变量
3. 查看 Vercel 函数日志

### 表创建失败

1. 查看错误日志
2. 检查 SQL 语法是否正确
3. 某些 SQLite 特定语法可能需要手动调整

### 数据迁移问题

1. 确保数据类型兼容
2. 检查外键约束
3. 验证数据完整性

## 回退方案

如果遇到问题，可以临时回退到 SQLite（仅本地开发）：

1. 移除 `POSTGRES_URL` 环境变量
2. 代码会自动使用 SQLite（仅非 Vercel 环境）

## 性能优化

PostgreSQL 相比 SQLite 的优势：

- ✅ 更好的并发性能
- ✅ 更强大的查询功能
- ✅ 更好的数据完整性
- ✅ 支持更复杂的数据类型
- ✅ 更好的索引支持

## 下一步

1. ✅ 部署到 Vercel
2. ✅ 验证数据库连接
3. ✅ 测试所有功能
4. ✅ 迁移现有数据（如果需要）

## 支持

如有问题，请查看：
- Vercel Postgres 文档：https://vercel.com/docs/storage/vercel-postgres
- PostgreSQL 文档：https://www.postgresql.org/docs/

