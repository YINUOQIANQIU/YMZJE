# 🚀 超快速开始指南

## 最简单的部署方式 - 只需 2 个环境变量！

### 第 1 步：注册 Supabase（2 分钟）

1. 访问 https://supabase.com
2. 点击 "Start your project"
3. 使用 GitHub 账号登录
4. 点击 "New Project"
5. 填写：
   - Project Name: 任意名称
   - Database Password: 设置密码（记住它！）
   - Region: `Southeast Asia (Singapore)`
6. 点击 "Create new project"
7. 等待创建完成（1-2 分钟）

### 第 2 步：获取 2 个值（30 秒）

在 Supabase Dashboard：

1. 点击左侧 **"Settings"** ⚙️
2. 点击 **"API"**
3. 复制这 2 个值：

   **① Project URL**
   ```
   https://xxxxx.supabase.co
   ```

   **② anon public key**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   （一长串字符）

### 第 3 步：在 Vercel 设置环境变量（1 分钟）

1. 登录 https://vercel.com
2. 进入您的项目
3. Settings → Environment Variables
4. 添加 2 个变量：

   **变量 1**：
   - Name: `SUPABASE_URL`
   - Value: 粘贴 Project URL
   - Environment: 全选 ✅

   **变量 2**：
   - Name: `SUPABASE_ANON_KEY`
   - Value: 粘贴 anon public key
   - Environment: 全选 ✅

### 第 4 步：初始化数据库表（1 次，1 分钟）

1. 在 Supabase Dashboard
2. 点击左侧 **"SQL Editor"**
3. 点击 **"New query"**
4. 打开项目中的 `server_modules/supabase-init.sql`
5. 复制所有 SQL 代码
6. 粘贴到 SQL Editor
7. 点击 **"Run"** 执行

### 第 5 步：推送代码

```bash
git add .
git commit -m "添加 Supabase 支持"
git push origin main
```

**完成！** 🎉

## 就这么简单！

- ✅ 只需 2 个环境变量
- ✅ 不需要数据库连接字符串
- ✅ 不需要手动创建数据库
- ✅ 代码自动适配

## 如果遇到问题

### 找不到 Project URL 或 Key？

1. 确保项目已创建完成（等待 1-2 分钟）
2. 刷新页面
3. 检查是否在正确的项目

### 环境变量未生效？

1. 重新部署项目（Redeploy）
2. 检查变量名称是否正确
3. 检查是否选择了所有环境

### 表创建失败？

1. 在 Supabase SQL Editor 手动执行 SQL
2. 检查错误信息
3. 确保 SQL 语法正确

## 验证

部署后，在 Vercel 日志中应该看到：
```
✅ Supabase 客户端初始化成功
数据库服务: Supabase (REST API)
```

## 总结

**只需 3 步**：
1. 注册 Supabase（2 分钟）
2. 设置 2 个环境变量（1 分钟）
3. 执行 SQL 初始化（1 分钟）

**就这么简单！** 🚀

