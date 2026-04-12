# 🧪 DS-160 Helper - 手动测试指南

由于自动化测试环境限制，请按以下步骤进行手动测试并反馈结果。

---

## ✅ 测试准备

**测试环境**: https://ds-160-ten.vercel.app  
**浏览器**: Chrome/Firefox/Safari（推荐 Chrome）  
**工具**: 浏览器开发者工具 (F12)

---

## 📋 测试步骤

### Test 1: 用户注册 ✨

1. **打开注册页面**  
   访问: https://ds-160-ten.vercel.app/signup

2. **打开开发者工具** (F12)  
   切换到 **Console** 和 **Network** 标签

3. **填写表单**  
   - Full name: `Test User`
   - Email: `testuser@example.com`
   - Password: `Test123456`

4. **点击 "Sign up"**

5. **验证结果**:
   - [ ] 没有显示 "Supabase not configured" 错误
   - [ ] 没有显示其他错误信息
   - [ ] 自动跳转到 `/dashboard`
   - [ ] 页面显示 "Dashboard" 标题
   - [ ] Network 标签显示 `/api/auth/signup` 请求成功 (200)
   - [ ] Application → Cookies 中存在 `auth_token`

**如果失败**: 截图 Console 和 Network 标签的错误信息

---

### Test 2: 登出

1. **在 Dashboard 页面**  
   查找并点击 "Logout" 或 "Sign Out" 按钮

2. **验证结果**:
   - [ ] 跳转到首页或登录页
   - [ ] `auth_token` cookie 被清除
   - [ ] 再次访问 `/dashboard` 会重定向到 `/login`

**如果没有登出按钮**: 手动清除 cookie:
   - 开发者工具 → Application → Cookies
   - 删除 `auth_token`

---

### Test 3: 用户登录

1. **访问登录页面**  
   https://ds-160-ten.vercel.app/login

2. **填写表单**  
   - Email: `testuser@example.com`
   - Password: `Test123456`

3. **点击 "Sign in"**

4. **验证结果**:
   - [ ] 登录成功
   - [ ] 跳转到 `/dashboard`
   - [ ] 显示用户邮箱
   - [ ] Network 标签显示 `/api/auth/login` 请求成功 (200)
   - [ ] 设置了新的 `auth_token` cookie

---

### Test 4: 验证错误处理

#### 4A: 重复注册

1. 访问 `/signup`
2. 使用相同邮箱 `testuser@example.com` 再次注册
3. **验证**: 
   - [ ] 显示 "Email already registered" 或类似错误
   - [ ] 没有跳转到 Dashboard

#### 4B: 错误密码登录

1. 访问 `/login`
2. 使用正确邮箱但错误密码登录
3. **验证**:
   - [ ] 显示 "Invalid credentials" 或类似错误
   - [ ] 没有跳转到 Dashboard

#### 4C: 短密码验证

1. 访问 `/signup`
2. 输入短密码 (如 "123")
3. 尝试提交
4. **验证**:
   - [ ] 显示 "Password must be at least 6 characters" 错误
   - [ ] 或浏览器阻止提交（HTML5 验证）

---

### Test 5: Dashboard 功能

1. **确保已登录**

2. **检查 Dashboard 页面元素**:
   - [ ] 显示 "Dashboard" 标题
   - [ ] 显示用户邮箱或名字
   - [ ] 显示进度统计卡片
   - [ ] 显示草稿列表或"Create New Draft"按钮

3. **如果有 "Create New Draft" 按钮**:
   - 点击按钮
   - **验证**: 创建了新草稿

---

### Test 6: 数据持久化（重要！）

1. **在 Dashboard 创建一个草稿**

2. **填写一些表单数据** (任意字段)

3. **刷新页面** (F5)

4. **验证结果**:
   - [ ] 草稿还在列表中
   - [ ] 之前填写的数据没有丢失
   - [ ] 进度百分比正确

**如果数据丢失**: 这是一个严重问题，需要修复！

---

### Test 7: 权限控制

1. **退出登录** (或清除 cookie)

2. **直接访问受保护页面**:
   - https://ds-160-ten.vercel.app/dashboard
   - https://ds-160-ten.vercel.app/profile

3. **验证结果**:
   - [ ] 自动重定向到 `/login`
   - [ ] 无法查看受保护内容

---

### Test 8: 路由检查

**验证旧路由已删除**:
- 访问 https://ds-160-ten.vercel.app/auth/login
  - [ ] 显示 404 或重定向到 `/login`
  
- 访问 https://ds-160-ten.vercel.app/auth/signup
  - [ ] 显示 404 或重定向到 `/signup`

---

## 📊 测试报告模板

测试完成后，复制以下模板并填写结果：

```
=== DS-160 Helper 测试报告 ===

测试时间: [填写]
浏览器: [Chrome/Firefox/Safari] 版本 [版本号]

【Test 1: 用户注册】
结果: ✅ 通过 / ❌ 失败
备注: 

【Test 2: 登出】
结果: ✅ 通过 / ❌ 失败
备注: 

【Test 3: 用户登录】
结果: ✅ 通过 / ❌ 失败
备注: 

【Test 4: 错误处理】
4A 重复注册: ✅ 通过 / ❌ 失败
4B 错误密码: ✅ 通过 / ❌ 失败
4C 短密码: ✅ 通过 / ❌ 失败

【Test 5: Dashboard 功能】
结果: ✅ 通过 / ❌ 失败
备注: 

【Test 6: 数据持久化】⭐ 重要
结果: ✅ 通过 / ❌ 失败
备注: 

【Test 7: 权限控制】
结果: ✅ 通过 / ❌ 失败

【Test 8: 路由检查】
结果: ✅ 通过 / ❌ 失败

【发现的问题】
1. 
2. 
3. 

【截图】
[如果有错误，请提供截图]
```

---

## 🐛 常见问题快速诊断

### 问题 1: 注册后立即报错
**检查**: Console 是否显示 JavaScript 错误？  
**检查**: Network 标签中 `/api/auth/signup` 返回什么状态码？

### 问题 2: 登录后无法跳转
**检查**: Network 标签中 `/api/auth/login` 是否成功？  
**检查**: Cookies 中是否设置了 `auth_token`？

### 问题 3: 数据不持久化
**检查**: Dashboard 有没有调用保存 API？  
**检查**: Network 标签中看草稿保存请求（如 `/api/drafts`）

### 问题 4: 页面空白或404
**检查**: Console 是否有路由错误？  
**检查**: 页面URL 是否正确（不应该有 `/auth/` 前缀）

---

## 🛠️ 如果遇到问题

把以下信息发给我：

1. **测试报告**（用上面的模板）
2. **Console 标签的错误**（完整的红色错误信息）
3. **Network 标签的失败请求**（点击请求查看 Response）
4. **截图**（如果有可视化问题）

我会根据你的反馈立即修复！🦞
