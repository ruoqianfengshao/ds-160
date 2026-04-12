# Google OAuth 配置指南

## 📋 第一步：在 Google Cloud Console 创建 OAuth 应用

### 1. 创建项目
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击顶部的项目下拉菜单 → **新建项目**
3. 项目名称：`DS-160 Helper`
4. 点击 **创建**

### 2. 启用 Google+ API
1. 在左侧菜单选择 **API 和服务** → **启用 API 和服务**
2. 搜索 `Google+ API`
3. 点击启用

### 3. 创建 OAuth 同意屏幕
1. 左侧菜单选择 **API 和服务** → **OAuth 同意屏幕**
2. 用户类型选择 **外部** → 点击 **创建**
3. 填写应用信息：
   - **应用名称**: `DS-160 Helper`
   - **用户支持电子邮件**: 你的邮箱
   - **开发者联系信息**: 你的邮箱
4. 点击 **保存并继续**
5. 作用域页面直接点击 **保存并继续**
6. 测试用户页面可以添加你的邮箱（用于测试），点击 **保存并继续**

### 4. 创建 OAuth 客户端 ID
1. 左侧菜单选择 **API 和服务** → **凭据**
2. 点击 **创建凭据** → **OAuth 客户端 ID**
3. 应用类型选择 **Web 应用**
4. 名称：`DS-160 Helper Web Client`
5. **已获授权的 JavaScript 来源**：
   - 本地开发：`http://localhost:3000`
   - 生产环境：`https://ds-160-ten.vercel.app`
6. **已获授权的重定向 URI**：
   - 本地开发：`http://localhost:3000/api/auth/google/callback`
   - 生产环境：`https://ds-160-ten.vercel.app/api/auth/google/callback`
7. 点击 **创建**
8. **保存好显示的客户端 ID 和客户端密钥**

---

## 🔐 第二步：配置环境变量

### 本地开发
在项目根目录的 `.env.local` 添加：

```bash
GOOGLE_CLIENT_ID=你的客户端ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=你的客户端密钥
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### Vercel 生产环境
运行以下命令添加环境变量：

```bash
cd ~/workspace/agent/workspace/ds160-helper

# 添加 Client ID
echo "你的客户端ID.apps.googleusercontent.com" > /tmp/google_client_id.txt
vercel env add GOOGLE_CLIENT_ID production < /tmp/google_client_id.txt
vercel env add GOOGLE_CLIENT_ID preview < /tmp/google_client_id.txt
vercel env add GOOGLE_CLIENT_ID development < /tmp/google_client_id.txt

# 添加 Client Secret
echo "你的客户端密钥" > /tmp/google_client_secret.txt
vercel env add GOOGLE_CLIENT_SECRET production < /tmp/google_client_secret.txt
vercel env add GOOGLE_CLIENT_SECRET preview < /tmp/google_client_secret.txt
vercel env add GOOGLE_CLIENT_SECRET development < /tmp/google_client_secret.txt

# 添加 Redirect URI (生产环境)
echo "https://ds-160-ten.vercel.app/api/auth/google/callback" > /tmp/google_redirect.txt
vercel env add GOOGLE_REDIRECT_URI production < /tmp/google_redirect.txt
vercel env add GOOGLE_REDIRECT_URI preview < /tmp/google_redirect.txt

# 清理临时文件
rm /tmp/google_*.txt
```

---

## 🚀 第三步：部署

### 推送代码到 GitHub
```bash
cd ~/workspace/agent/workspace/ds160-helper
git add -A
git commit -m "feat: add Google OAuth login"
git push
```

Vercel 会自动部署。

---

## ✅ 第四步：测试

### 本地测试
```bash
npm run dev
```

访问 http://localhost:3000/login，点击 "Sign in with Google"

### 生产环境测试
访问 https://ds-160-ten.vercel.app/login，点击 "Sign in with Google"

---

## 🔍 故障排查

### 错误：redirect_uri_mismatch
**原因**：重定向 URI 配置不匹配

**解决**：
1. 检查 Google Cloud Console 中的重定向 URI 是否完全一致
2. 确保环境变量 `GOOGLE_REDIRECT_URI` 正确

### 错误：OAuth error
**原因**：客户端 ID 或密钥错误

**解决**：
1. 检查环境变量是否正确设置
2. 重新生成客户端密钥

### 首次登录后数据库错误
**原因**：数据库 schema 不兼容

**解决**：
- Google OAuth 用户的 `password_hash` 字段存储为 `'OAUTH_GOOGLE'`
- 这些用户不能用密码登录，只能用 Google 登录

---

## 📝 功能说明

### 登录流程
1. 用户点击 "Sign in with Google"
2. 重定向到 Google 授权页面
3. 用户授权后返回到 `/api/auth/google/callback`
4. 后端验证 Google token
5. 检查用户是否存在：
   - 存在：直接登录
   - 不存在：自动创建账号（邮箱 + Google 头像）
6. 设置 JWT cookie
7. 重定向到 Dashboard

### 数据存储
- **邮箱**：从 Google 获取
- **头像**：从 Google 获取
- **密码**：存储为 `'OAUTH_GOOGLE'`（不可用密码登录）
- **姓名**：从 Google 获取

---

## 🎉 完成！

现在你的应用支持：
- ✅ 传统邮箱+密码登录
- ✅ Google OAuth 登录
- ✅ 自动创建 OAuth 用户
- ✅ 统一的用户系统

需要我帮你执行配置命令吗？🦞
