# ✅ Vercel Postgres 部署检查清单

## 📋 部署步骤（必须按顺序完成）

### 1. ✅ 代码已推送到 GitHub
- [x] 提交记录：`019d2874 feat: integrate Vercel Postgres authentication and database`
- [x] 仓库地址：https://github.com/ruoqianfengshao/ds-160

### 2. ⏳ 等待 Vercel 自动部署
Vercel 会检测到新提交并自动重新部署（约 2-3 分钟）

### 3. 🗄️ 创建 Vercel Postgres 数据库

**在 Vercel Dashboard 操作：**

1. 访问 https://vercel.com/dashboard
2. 进入你的项目 `ds-160`
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **Postgres**
6. 区域选择：**US East (iad1)** 或离你最近的区域
7. 点击 **Create**
8. 等待数据库创建完成（约 30 秒）

✅ **数据库创建后，环境变量会自动注入！**

### 4. 📝 运行数据库迁移

**方式 A：Vercel Dashboard（推荐）**

1. Storage → Postgres → 你的数据库
2. 点击 **Query** 标签
3. 打开项目中的 `vercel-postgres-schema.sql`
4. 复制全部内容（77 行 SQL）
5. 粘贴到 Query 编辑器
6. 点击 **Run** 或按 `Cmd/Ctrl + Enter`
7. 确认看到成功消息

**方式 B：本地命令行**

```bash
# 拉取环境变量
vercel env pull .env.local

# 运行迁移
psql $POSTGRES_URL < vercel-postgres-schema.sql
```

### 5. 🔐 配置 JWT Secret

**生成 Secret：**

```bash
openssl rand -base64 32
# 输出示例: kX7j9mP4nQ8rY2sZ5vW6tU3lH1dF0cB9aE8gK4jM6nL2=
```

**添加到 Vercel：**

1. 项目设置 → **Environment Variables**
2. 点击 **Add New**
3. **Name**: `JWT_SECRET`
4. **Value**: 粘贴刚才生成的字符串
5. **Environment**: 勾选 `Production`, `Preview`, `Development`
6. 点击 **Save**

### 6. 🔄 触发重新部署

**方式 A：在 Vercel Dashboard**
1. Deployments 标签
2. 点击最新的部署
3. 点击 **Redeploy**

**方式 B：推送任意修改**
```bash
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

### 7. ✅ 验证部署

**访问你的应用：**
- 主域名：https://ds-160-ten.vercel.app

**测试功能：**

1. **注册页面**
   - 访问 https://ds-160-ten.vercel.app/signup
   - 输入邮箱、密码
   - 点击 Sign up
   - 应该自动跳转到 Dashboard

2. **登录页面**
   - 访问 https://ds-160-ten.vercel.app/login
   - 使用刚才注册的账号登录
   - 应该自动跳转到 Dashboard

3. **Dashboard**
   - 查看是否能创建新草稿
   - 填写表单并保存
   - 刷新页面查看数据是否持久化

### 8. 🐛 故障排查

**如果遇到问题：**

1. **检查环境变量**
   - Settings → Environment Variables
   - 确保有 `POSTGRES_URL` 等数据库变量（自动注入）
   - 确保有 `JWT_SECRET`（手动添加）

2. **查看日志**
   - Deployments → 最新部署 → **Runtime Logs**
   - 查看是否有错误信息

3. **常见错误及解决方案**

   | 错误 | 原因 | 解决方案 |
   |------|------|----------|
   | `JWT_SECRET is not defined` | 未配置环境变量 | 添加 JWT_SECRET 并重新部署 |
   | `relation "users" does not exist` | 未运行数据库迁移 | 在 Vercel Storage Query 中运行 SQL |
   | `Cannot connect to database` | 数据库未创建 | 在 Storage 标签创建 Postgres 数据库 |
   | `401 Unauthorized` | Cookie 未设置 | 检查浏览器 DevTools → Application → Cookies |

---

## 📊 部署后的功能

### ✅ 用户认证
- [x] 邮箱 + 密码注册
- [x] 登录/登出
- [x] JWT token 会话管理
- [x] Cookie-based 认证

### ✅ 数据持久化
- [x] 草稿自动保存到数据库
- [x] 支持多个草稿
- [x] Dashboard 草稿列表
- [x] 草稿 CRUD 操作

### ✅ 同步系统
- [x] localStorage 离线缓存
- [x] 自动云同步（2秒防抖）
- [x] 同步历史记录

---

## 🎯 预期结果

完成所有步骤后，你应该能够：

1. ✅ 在 https://ds-160-ten.vercel.app 访问应用
2. ✅ 注册新账号
3. ✅ 登录并创建草稿
4. ✅ 填写 DS-160 表单
5. ✅ 数据自动保存到 Vercel Postgres
6. ✅ 刷新页面后数据仍然存在
7. ✅ 在 Dashboard 看到所有草稿

---

## 📚 下一步

- [ ] 添加 Google OAuth 登录
- [ ] 实现密码重置功能
- [ ] 添加用户资料页
- [ ] 实现套餐升级
- [ ] 添加 PDF 导出功能

---

**需要帮助？** 查看 `VERCEL_POSTGRES_SETUP.md` 获取详细文档。
