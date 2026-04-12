# 📋 DS-160 Helper 注册登录测试指南

## 🎯 测试目标
验证基本的用户注册、登录、Dashboard 访问流程是否正常工作。

---

## ✅ 测试步骤

### 第 1 步：注册新账号

1. **打开注册页面**
   - 访问：https://ds-160-ten.vercel.app/signup
   
2. **填写表单**
   - Full name: `Test User` (可选)
   - Email: `test001@example.com`
   - Password: `test123456` (至少 6 位)

3. **提交注册**
   - 点击 "Sign up" 按钮

4. **预期结果**
   - ✅ 自动跳转到 Dashboard (`/dashboard`)
   - ✅ 看到 "Welcome, test001@example.com" 或类似欢迎信息
   - ✅ 浏览器设置了 `auth_token` cookie

5. **如果失败**
   - 打开浏览器开发者工具 (F12)
   - 查看 Console 标签的错误信息
   - 查看 Network 标签的 `/api/auth/signup` 请求：
     - 状态码是什么？
     - Response 返回了什么？

---

### 第 2 步：退出登录

1. **点击 Logout 按钮**（如果 Dashboard 有的话）
   - 或者手动清除 cookie：
     - 打开开发者工具 → Application → Cookies
     - 删除 `auth_token`

2. **预期结果**
   - ✅ 跳转回登录页面

---

### 第 3 步：重新登录

1. **打开登录页面**
   - 访问：https://ds-160-ten.vercel.app/login

2. **填写表单**
   - Email: `test001@example.com`
   - Password: `test123456`

3. **提交登录**
   - 点击 "Sign in" 按钮

4. **预期结果**
   - ✅ 自动跳转到 Dashboard
   - ✅ 看到之前的用户信息
   - ✅ 浏览器设置了新的 `auth_token` cookie

---

### 第 4 步：测试 Dashboard 功能

1. **创建 DS-160 草稿**
   - 点击 "Create New Draft" 或类似按钮
   - 填写一些表单数据
   - 点击保存

2. **刷新页面**
   - 按 F5 或点击浏览器刷新按钮

3. **预期结果**
   - ✅ 数据没有丢失
   - ✅ 之前填写的内容还在
   - ✅ 数据已持久化到 Postgres

---

## 🔍 故障排查

### 问题 1：注册后显示 "Signup failed" 或 500 错误

**可能原因**：
- 数据库连接失败
- JWT_SECRET 未配置

**检查方法**：
1. 打开开发者工具 → Network
2. 查看 `/api/auth/signup` 请求
3. 右键 → Copy as cURL
4. 把 cURL 命令发给我分析

**或者查看 Vercel 日志**：
```bash
cd ~/workspace/agent/workspace/ds160-helper
vercel logs --follow
```

---

### 问题 2：登录后跳转到 `/login?error=oauth_failed`

**原因**：
- 代码中有 Google OAuth 相关错误处理

**解决**：
- 忽略这个错误提示（Google OAuth 还没配置）
- 或者用正常的邮箱/密码登录

---

### 问题 3：Dashboard 显示空白或 404

**可能原因**：
- Dashboard 页面没有正确渲染
- 路由配置问题

**检查方法**：
1. 打开开发者工具 → Console
2. 查看是否有 JavaScript 错误
3. 检查 `/dashboard` 路由是否存在

---

### 问题 4：数据不持久化

**可能原因**：
- 数据库写入失败
- API 请求失败

**检查方法**：
1. 开发者工具 → Network
2. 查看保存草稿时的 API 请求（如 `/api/drafts`）
3. 检查响应状态码和内容

---

## 📊 测试报告模板

完成测试后，把结果告诉我：

```
【注册测试】
✅ / ❌ 注册成功并跳转到 Dashboard
备注：

【登录测试】
✅ / ❌ 登录成功并跳转到 Dashboard
备注：

【Dashboard 功能测试】
✅ / ❌ 能够创建草稿
✅ / ❌ 刷新后数据还在
备注：

【发现的问题】
1. 
2. 
```

---

## 🛠️ 如果遇到问题

把以下信息发给我：

1. **截图**
   - 错误页面
   - 开发者工具 Console 标签
   - 开发者工具 Network 标签（失败的请求详情）

2. **具体现象**
   - 在哪一步失败的？
   - 显示了什么错误信息？

3. **浏览器信息**
   - 什么浏览器？（Chrome / Firefox / Safari）
   - 版本号

我会根据你的反馈调整代码！🦞
