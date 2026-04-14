# 5分钟快速设置 Supabase

## 🎯 目标
将 DS-160 Helper 从 Vercel Postgres 迁移到 Supabase，获得：
- ✅ 更大的免费额度
- ✅ 更好的性能
- ✅ 零额外费用

## ⏱️ 时间估算
- **有现有数据**: 约15分钟
- **全新开始**: 约5分钟

---

## 步骤 1: 创建 Supabase 项目（2分钟）

### 1.1 注册/登录 Supabase
```bash
# 打开浏览器访问
https://supabase.com/dashboard
```

### 1.2 创建新项目
- 点击 **"New Project"**
- 填写信息：
  - **Project name**: `ds160-helper`
  - **Database Password**: 选择强密码（**记住它！**）
  - **Region**: Singapore 或 Tokyo（离中国近）
- 点击 **"Create new project"**
- ⏳ 等待 2 分钟...

---

## 步骤 2: 配置数据库（1分钟）

### 2.1 打开 SQL Editor
1. 左侧菜单点击 **"SQL Editor"**
2. 点击 **"New Query"**

### 2.2 运行迁移脚本
```bash
# 在项目中打开 supabase/schema.sql
cd ~/workspace/agent/workspace/ds-160
cat supabase/schema.sql
```

3. **复制全部内容** 到 SQL Editor
4. 点击 **"Run"**
5. ✅ 看到成功消息（约10秒）

---

## 步骤 3: 获取 API 凭证（1分钟）

### 3.1 获取 URL 和 Key
1. 左侧菜单点击 **"Settings"** > **"API"**
2. 复制以下内容：

```env
# Project URL
SUPABASE_URL=https://xxxxxxxx.supabase.co

# anon public key
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# service_role key (可选)
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3.2 创建 .env 文件
```bash
cd ~/workspace/agent/workspace/ds-160

# 创建 .env
cat > .env << 'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
EOF

# 编辑并替换为实际值
nano .env
```

---

## 步骤 4: 测试本地连接（1分钟）

```bash
# 启动开发服务器
npm run dev

# 测试注册
# 1. 访问 http://localhost:3000/auth/signup
# 2. 创建测试账号: test@example.com / password123

# 验证
# 1. 打开 Supabase 控制台
# 2. Table Editor > profiles
# 3. 应该看到刚注册的用户 ✅
```

---

## 步骤 5: 部署到 Vercel（30秒）

### 5.1 设置 Vercel 环境变量
```bash
vercel env add SUPABASE_URL
# 输入: https://your-project.supabase.co

vercel env add SUPABASE_KEY
# 输入: your-anon-key

vercel env add SUPABASE_SERVICE_KEY
# 输入: your-service-key

vercel env add JWT_SECRET
# 输入: your-jwt-secret
```

### 5.2 推送代码触发部署
```bash
git push origin main

# Vercel 会自动部署（约1-2分钟）
```

---

## ✅ 完成！验证清单

- [ ] Supabase 项目创建成功
- [ ] 数据库表已创建（profiles, ds160_drafts）
- [ ] .env 文件配置正确
- [ ] 本地注册功能正常
- [ ] 本地数据同步正常
- [ ] Vercel 环境变量已设置
- [ ] 生产环境部署成功

---

## 🚨 常见问题

### Q: "Failed to fetch" 错误
**A**: 检查 SUPABASE_URL 是否正确，确保包含 `https://`

### Q: 注册后没有在 Supabase 看到用户
**A**: 
1. 检查 `.env` 文件是否正确
2. 重启开发服务器 (`npm run dev`)
3. 查看浏览器控制台是否有错误

### Q: RLS 策略错误
**A**: 确保 `supabase/schema.sql` 完整执行，检查 SQL Editor 是否有错误消息

### Q: Vercel 部署后仍然是 Postgres
**A**: 环境变量设置后需要触发新的部署（推送代码或手动触发）

---

## 📊 资源使用对比

### Vercel Postgres 免费版
- 60 小时/月计算时间 ⏰
- 256 MB 存储 💾
- 超额收费: $0.50/小时 💸

### Supabase 免费版
- 500 MB 数据库 💾
- 50,000 月活用户 👥
- 5 GB 带宽 📶
- **完全免费** ✅

---

## 🎓 下一步

迁移完成后，可以探索 Supabase 的高级功能：

1. **实时订阅** - 多人协作实时同步
2. **存储桶** - 上传护照照片
3. **边缘函数** - 无服务器 API
4. **数据库备份** - 自动备份

---

## 需要帮助？

- 📖 [完整迁移指南](./MIGRATION_GUIDE.md)
- 🔧 [自动迁移脚本](./migrate-to-supabase.sh)
- 📚 [Supabase 文档](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)

---

**建议：尽快完成迁移，避免 Vercel Postgres 免费额度用完后产生费用！**
