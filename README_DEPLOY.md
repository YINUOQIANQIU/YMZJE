# 🚀 一键部署指南

## 最简单的部署方式 - 使用 Supabase（推荐）

### 只需 3 步，5 分钟完成！

#### 第 1 步：注册 Supabase（2 分钟）

1. 访问 https://supabase.com
2. 点击 "Start your project" 或 "Sign up"
3. 使用 GitHub 账号登录（最简单）
4. 点击 "New Project"
5. 填写信息：
   - Project Name: `yunmengzhijian`（或任意名称）
   - Database Password: 设置一个强密码（**记住这个密码！**）
   - Region: 选择 `Southeast Asia (Singapore)`（离中国最近）
6. 点击 "Create new project"
7. 等待 1-2 分钟，项目创建完成

#### 第 2 步：获取连接信息（超简单！只需 2 个值）

项目创建完成后：

1. 在 Supabase Dashboard，点击左侧菜单 **"Settings"**（设置图标 ⚙️）
2. 点击 **"API"** 选项
3. 复制以下 **2 个值**（就这些，不需要其他东西！）：

   **值 1：Project URL**
   - 在页面顶部找到 **"Project URL"** 或 **"URL"**
   - 点击旁边的复制图标 📋 或手动复制
   - 格式：`https://xxxxx.supabase.co`

   **值 2：anon public key**
   - 在 "Project API keys" 部分
   - 找到 **"anon"** 或 **"public"** 这一行
   - 复制 **"anon public"** key（一长串字符，通常以 `eyJ` 开头）
   - 点击旁边的眼睛图标 👁️ 可以显示完整 key

**就这么简单！不需要数据库连接字符串！** 🎉

代码会自动使用 Supabase REST API，无需配置数据库连接。

**如果找不到这些值**：
- 确保项目已完全创建（等待 1-2 分钟）
- 刷新页面
- 检查是否在正确的项目页面

#### 第 3 步：在 Vercel 设置环境变量（只需 2 个！）

1. 登录 Vercel：https://vercel.com
2. 进入您的项目
3. 点击 **"Settings"** → **"Environment Variables"**
4. 添加以下 **2 个变量**（不需要第 3 个！）：

   **变量 1**：
   - Name: `SUPABASE_URL`
   - Value: 粘贴您复制的 Project URL
   - Environment: 选择 `Production`, `Preview`, `Development`（全选）
   - 点击 **"Save"**

   **变量 2**：
   - Name: `SUPABASE_ANON_KEY`
   - Value: 粘贴您复制的 anon public key
   - Environment: 全选
   - 点击 **"Save"**

**完成！不需要设置数据库连接字符串！** ✅

#### 第 4 步：初始化数据库表（1 分钟）

1. 回到 Supabase Dashboard
2. 点击左侧菜单 "SQL Editor"
3. 点击 "New query"
4. 打开项目中的 `server_modules/supabase-init.sql` 文件
5. 复制所有 SQL 代码
6. 粘贴到 Supabase SQL Editor
7. 点击 "Run" 执行
8. 应该看到 "Success. No rows returned"

#### 第 5 步：推送代码并部署

```bash
# 1. 提交所有更改
git add .
git commit -m "添加 Supabase 数据库支持"

# 2. 推送到 GitHub
git push origin main
```

Vercel 会自动检测并部署！

#### 完成！🎉

部署完成后：
- ✅ 访问您的 Vercel URL
- ✅ 所有功能应该正常工作
- ✅ 数据库已自动连接

## 验证部署

1. 在 Vercel Dashboard 查看部署日志
2. 应该看到：`✅ 成功连接到 PostgreSQL 数据库`
3. 应该看到：`数据库服务: Supabase`
4. 测试登录、注册等功能

## 如果遇到问题

### 问题：环境变量未生效
- 解决：重新部署项目（Redeploy）

### 问题：数据库连接失败
- 检查：环境变量是否正确设置
- 检查：Supabase 项目是否激活
- 检查：数据库密码是否正确

### 问题：表未创建
- 解决：在 Supabase SQL Editor 手动执行 `supabase-init.sql`

## 免费额度

### Supabase 免费版包括：
- ✅ 500MB 数据库空间
- ✅ 2GB 带宽/月
- ✅ 50,000 月活跃用户
- ✅ 完全够用！

### Vercel 免费版包括：
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 完全够用！

## 总结

使用这个方案：
- ✅ **完全免费**
- ✅ **只需注册 Supabase 和设置环境变量**
- ✅ **无需在 Vercel 手动创建数据库**
- ✅ **代码自动适配**
- ✅ **一次设置，永久使用**

**就是这么简单！** 🎉

