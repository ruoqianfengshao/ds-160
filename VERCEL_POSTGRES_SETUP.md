# Vercel Postgres 部署指南

## 🚀 快速部署（5分钟）

### 1. 创建 Vercel Postgres 数据库

1. 访问 Vercel Dashboard
2. 进入你的项目（ds-160）
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **Postgres**
6. 选择区域（建议 US East）
7. 点击 **Create**

✅ 数据库连接环境变量会**自动注入**到你的项目中！

### 2. 运行数据库迁移

**方式 A：通过 Vercel Dashboard（推荐）**

1. 在 Storage → Postgres → 你的数据库
2. 点击 **Query** 标签
3. 复制 `vercel-postgres-schema.sql` 的内容
4. 粘贴并运行

**方式 B：通过 Vercel CLI**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 链接项目
vercel link

# 运行迁移
vercel env pull .env.local
psql $POSTGRES_URL < vercel-postgres-schema.sql
```

### 3. 配置 JWT Secret

```bash
# 生成 JWT secret
openssl rand -base64 32

# 在 Vercel Dashboard 添加环境变量
# Settings → Environment Variables
# 名称: JWT_SECRET
# 值: 刚才生成的字符串
# 环境: Production, Preview, Development
```

### 4. 重新部署

```bash
git add .
git commit -m "feat: integrate Vercel Postgres"
git push origin main
```

Vercel 会自动重新部署！

---

## ✅ 验证部署

### 测试注册

```bash
curl -X POST https://your-app.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User"
  }'
```

### 测试登录

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

---

## 📊 免费额度

**Vercel Postgres（Hobby Plan）：**
- ✅ 256 MB 存储
- ✅ 60 小时计算时间/月
- ✅ 1,000 次数据库连接/小时
- ✅ 自动连接池
- ✅ 边缘网络支持

**足够支撑：**
- 1,000+ 用户
- 10,000+ 草稿
- 100,000+ 请求/月

---

## 🔧 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 拉取环境变量

```bash
vercel env pull .env.local
```

### 3. 运行数据库迁移

```bash
# 确保 .env.local 存在
psql $POSTGRES_URL < vercel-postgres-schema.sql
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 🔒 安全注意事项

1. **JWT Secret 必须是随机的强密钥**
2. **生产环境使用 HTTPS**（Vercel 自动配置）
3. **定期更新依赖**
4. **限制 API 速率**（Vercel Edge Functions 自带）
5. **不要提交 `.env` 文件到 Git**

---

## 🐛 常见问题

### Q: 部署后 API 报 500 错误？
A: 检查数据库迁移是否成功运行。访问 Vercel Dashboard → Storage → Query 手动运行 `vercel-postgres-schema.sql`。

### Q: JWT Secret 错误？
A: 确保在 Vercel Environment Variables 中设置了 `JWT_SECRET`，并重新部署。

### Q: 数据库连接失败？
A: Vercel Postgres 环境变量需要 1-2 分钟生效。等待后重新部署。

### Q: 本地开发连接不上数据库？
A: 运行 `vercel env pull .env.local` 拉取最新环境变量。

---

## 📚 相关资源

- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Nuxt 3 文档](https://nuxt.com/docs)
- [@vercel/postgres API](https://vercel.com/docs/storage/vercel-postgres/sdk)

---

**部署完成后，访问你的应用并尝试注册/登录！** 🎉
