# 从 Vercel Postgres 迁移到 Supabase

## 为什么要迁移？

### Vercel Postgres 限制
- ❌ 免费额度有限（60小时计算时间/月）
- ❌ 存储空间限制（256MB）
- ❌ 连接数限制
- ❌ 可能产生超额费用

### Supabase 优势
- ✅ 免费额度更大（500MB 数据库，50000 月活用户）
- ✅ 内置认证系统
- ✅ 实时订阅功能
- ✅ Row Level Security (RLS)
- ✅ 自动备份
- ✅ 更好的开发体验

## 快速迁移步骤

### 1. 创建 Supabase 项目（5分钟）

```bash
# 访问 Supabase 控制台
open https://supabase.com/dashboard

# 创建新项目
# - 项目名称：ds160-helper
# - 数据库密码：选择一个强密码（记住它！）
# - 区域：选择离你最近的（如 Singapore 或 Tokyo）
```

### 2. 运行数据库迁移（2分钟）

```bash
# 在 Supabase 控制台中：
# 1. 点击左侧 "SQL Editor"
# 2. 点击 "New Query"
# 3. 复制 supabase/schema.sql 的全部内容
# 4. 粘贴并点击 "Run"

# 等待执行完成，应该看到：
✅ Created table: profiles
✅ Created table: ds160_drafts
✅ Created table: sync_history
✅ Created indexes
✅ Enabled RLS policies
✅ Created functions
```

### 3. 配置环境变量（3分钟）

```bash
# 在 Supabase 控制台中：
# 1. 点击左侧 "Settings" > "API"
# 2. 复制以下信息：
#    - Project URL
#    - anon public key

# 创建 .env 文件
cat > .env << 'EOF'
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT Secret (生成新的)
JWT_SECRET=$(openssl rand -base64 32)
EOF

# 替换为你的实际值
nano .env
```

### 4. 更新 Vercel 环境变量（2分钟）

```bash
# 在 Vercel 控制台中：
# 1. 打开你的项目
# 2. Settings > Environment Variables
# 3. 添加以下变量：
#    - SUPABASE_URL
#    - SUPABASE_KEY
#    - SUPABASE_SERVICE_KEY
#    - JWT_SECRET

# 或使用 Vercel CLI
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
vercel env add SUPABASE_SERVICE_KEY
```

### 5. 测试本地连接（2分钟）

```bash
# 启动开发服务器
npm run dev

# 测试注册
# 1. 访问 http://localhost:3000/auth/signup
# 2. 创建测试账号
# 3. 检查 Supabase 控制台 > Table Editor > profiles
#    应该能看到新用户

# 测试数据同步
# 1. 填写表单
# 2. 点击"同步到云端"
# 3. 检查 Supabase 控制台 > Table Editor > ds160_drafts
#    应该能看到保存的草稿
```

### 6. 部署到生产环境（1分钟）

```bash
# 推送代码（环境变量已在 Vercel 设置）
git push origin main

# Vercel 会自动部署
# 等待部署完成后，访问生产 URL 测试
```

## 数据迁移（如果有现有数据）

### 从 Vercel Postgres 导出数据

```bash
# 使用 Vercel CLI 导出
vercel env pull .env.vercel
source .env.vercel

# 连接到 Vercel Postgres
psql $POSTGRES_URL -c "COPY (SELECT * FROM users) TO STDOUT CSV HEADER" > users.csv
psql $POSTGRES_URL -c "COPY (SELECT * FROM drafts) TO STDOUT CSV HEADER" > drafts.csv
```

### 导入到 Supabase

```bash
# 在 Supabase SQL Editor 中运行：
-- 导入用户数据
COPY profiles (id, email, full_name, created_at)
FROM '/path/to/users.csv' 
DELIMITER ',' CSV HEADER;

-- 导入草稿数据
COPY ds160_drafts (id, user_id, form_data, created_at, updated_at)
FROM '/path/to/drafts.csv'
DELIMITER ',' CSV HEADER;
```

## 验证清单

### 数据库
- [ ] Supabase 项目创建成功
- [ ] schema.sql 执行无错误
- [ ] RLS 策略已启用
- [ ] 测试账号可以注册
- [ ] 测试数据可以保存

### 应用
- [ ] .env 文件配置正确
- [ ] 本地开发服务器正常运行
- [ ] 注册功能正常
- [ ] 登录功能正常
- [ ] 数据同步功能正常

### 部署
- [ ] Vercel 环境变量已配置
- [ ] 生产环境部署成功
- [ ] 生产环境测试通过

## 回滚方案（如果需要）

```bash
# 如果 Supabase 出现问题，可以临时回滚到 Vercel Postgres

# 1. 在 Vercel 控制台删除 Supabase 相关的环境变量
# 2. 添加回 Vercel Postgres 变量
# 3. 重新部署

vercel env rm SUPABASE_URL
vercel env rm SUPABASE_KEY
vercel env add POSTGRES_URL
```

## 成本对比

### Vercel Postgres 免费计划
- 60 小时计算时间/月
- 256 MB 存储
- 1 个数据库
- **超额费用**：$0.50/小时

### Supabase 免费计划
- 500 MB 数据库
- 50,000 月活用户
- 5 GB 带宽
- 1 GB 文件存储
- 2 个并发连接
- **完全免费**，无隐藏费用

## 常见问题

### Q: 迁移需要多长时间？
A: 如果没有现有数据，约15分钟。有数据需要额外5-10分钟。

### Q: 迁移期间会停机吗？
A: 不会。新部署上线后，流量会自动切换。

### Q: 现有用户数据会丢失吗？
A: 不会。按照数据迁移步骤操作，所有数据都会保留。

### Q: Supabase 真的免费吗？
A: 是的。免费计划对于个人项目和小型应用完全够用。

### Q: 可以随时切换回 Vercel Postgres 吗？
A: 可以。环境变量是独立的，切换很容易。

## 后续优化

迁移完成后，可以利用 Supabase 的高级功能：

1. **实时订阅** - 多人协作时实时同步数据
2. **Row Level Security** - 更精细的数据权限控制
3. **存储桶** - 上传护照照片、签名等
4. **边缘函数** - 无服务器后端逻辑
5. **数据库备份** - 自动备份和恢复

## 需要帮助？

- 📖 [Supabase 官方文档](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐛 [项目 Issues](https://github.com/ruoqianfengshao/ds-160/issues)

---

**建议：** 尽快迁移到 Supabase，避免 Vercel Postgres 免费额度用完后产生费用。
