# Supabase 数据库连接字符串获取指南

如果 Supabase Dashboard 中没有直接显示连接字符串，可以使用以下方法获取。

## 方法 1: 从 Database Settings 获取

1. 进入 Supabase Dashboard
2. 点击左侧菜单 "Settings" → "Database"
3. 查找以下任一位置：
   - **Connection string** 部分
   - **Connection pooling** 部分
   - **Connection info** 部分
   - **Database URL** 部分

4. 如果看到连接字符串，直接复制

## 方法 2: 手动构建连接字符串

如果找不到现成的连接字符串，可以手动构建：

### 步骤 1: 获取项目信息

1. 在 Supabase Dashboard，点击 "Settings" → "General"
2. 找到 "Reference ID"（项目引用ID，例如：`abcdefghijklmnop`）
3. 记住这个 ID

### 步骤 2: 获取数据库信息

1. 点击 "Settings" → "Database"
2. 找到以下信息：
   - **Host**: 通常是 `db.[项目引用ID].supabase.co`
   - **Database name**: 通常是 `postgres`
   - **Port**: 通常是 `5432`
   - **User**: 通常是 `postgres.[项目引用ID]`
   - **Password**: 您创建项目时设置的数据库密码

### 步骤 3: 构建连接字符串

格式：
```
postgresql://postgres.[项目引用ID]:[您的密码]@db.[项目引用ID].supabase.co:5432/postgres
```

**示例**：
- 项目引用ID: `abcdefghijklmnop`
- 密码: `MyPassword123!`

连接字符串：
```
postgresql://postgres.abcdefghijklmnop:MyPassword123!@db.abcdefghijklmnop.supabase.co:5432/postgres
```

## 方法 3: 使用 Supabase CLI（高级）

如果安装了 Supabase CLI：

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref your-project-ref

# 获取连接字符串
supabase db get-connection-string
```

## 方法 4: 从 Project URL 推断

1. 您的 Project URL 是：`https://abcdefghijklmnop.supabase.co`
2. 项目引用ID就是：`abcdefghijklmnop`
3. 数据库 Host 就是：`db.abcdefghijklmnop.supabase.co`
4. 用户就是：`postgres.abcdefghijklmnop`
5. 密码是您创建项目时设置的

## 验证连接字符串

连接字符串格式应该是：
```
postgresql://[用户]:[密码]@[主机]:[端口]/[数据库名]
```

各部分说明：
- `postgresql://` - 协议
- `postgres.xxxxx` - 用户名（xxxxx 是项目引用ID）
- `:密码` - 密码（URL 编码，特殊字符需要编码）
- `@db.xxxxx.supabase.co` - 主机地址
- `:5432` - 端口
- `/postgres` - 数据库名

## 常见问题

### 问题：密码包含特殊字符

如果密码包含特殊字符（如 `@`, `#`, `%` 等），需要进行 URL 编码：

- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `=` → `%3D`
- `+` → `%2B`
- ` ` (空格) → `%20`

**示例**：
- 原始密码：`My@Pass#123`
- 编码后：`My%40Pass%23123`
- 连接字符串：`postgresql://postgres.xxxxx:My%40Pass%23123@db.xxxxx.supabase.co:5432/postgres`

### 问题：找不到项目引用ID

1. 在 Dashboard 顶部，URL 中可以看到项目引用ID
2. 或者在 "Settings" → "General" → "Reference ID"

### 问题：忘记数据库密码

1. 进入 "Settings" → "Database"
2. 找到 "Reset database password" 选项
3. 重置密码（注意：这会影响现有连接）

## 快速检查清单

- [ ] 已获取项目引用ID
- [ ] 已找到或记住数据库密码
- [ ] 已构建连接字符串
- [ ] 连接字符串格式正确
- [ ] 已在 Vercel 设置 `SUPABASE_DB_URL` 环境变量

## 测试连接

设置环境变量后，可以在 Vercel 函数日志中查看：
- ✅ 如果看到 "成功连接到 PostgreSQL 数据库"，说明连接成功
- ❌ 如果看到连接错误，检查连接字符串是否正确

