# 🚀 DS-160 Helper - 部署检查清单

## 📋 部署前准备

### 1. Supabase 设置 ⬜
- [ ] 创建 Supabase 项目（https://supabase.com）
- [ ] 复制 Project URL 和 API Keys
- [ ] 在 SQL Editor 中运行 `supabase/schema.sql`
- [ ] 验证表已创建（profiles, ds160_drafts, sync_history）
- [ ] 验证 RLS 策略已启用
- [ ] 测试数据库函数（check_sync_quota, increment_sync_count）

### 2. 环境变量配置 ⬜
- [ ] 创建 `.env` 文件（基于 `.env.example`）
- [ ] 填写 `SUPABASE_URL`
- [ ] 填写 `SUPABASE_KEY`（anon public key）
- [ ] 填写 `SUPABASE_SERVICE_KEY`（可选，service role key）
- [ ] 确认 `.env` 在 `.gitignore` 中

### 3. 本地测试 ⬜
- [ ] 运行 `npm install`
- [ ] 运行 `npm run dev`
- [ ] 测试用户注册
- [ ] 测试用户登录
- [ ] 测试表单填写和自动保存
- [ ] 测试云同步功能
- [ ] 测试多草稿创建和切换
- [ ] 测试离线模式
- [ ] 测试配额系统
- [ ] 检查浏览器控制台无错误

### 4. 构建测试 ⬜
- [ ] 运行 `npm run build`
- [ ] 检查构建无错误
- [ ] 运行 `npm run preview`
- [ ] 测试生产构建版本

---

## 🌐 Vercel 部署

### 步骤 1: 准备代码仓库
```bash
# 提交所有更改
git add .
git commit -m "Add authentication and database integration"
git push origin main
```

### 步骤 2: 连接 Vercel
1. 访问 https://vercel.com
2. 点击 "Import Project"
3. 选择你的 GitHub 仓库
4. 项目名称：`ds160-helper`
5. Framework Preset: Nuxt.js

### 步骤 3: 配置环境变量
在 Vercel 项目设置中添加：

```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_KEY = your-anon-key-here
SUPABASE_SERVICE_KEY = your-service-role-key-here
```

⚠️ **重要**: 不要在代码中硬编码这些值！

### 步骤 4: 部署
- [ ] 点击 "Deploy" 按钮
- [ ] 等待构建完成（约 2-3 分钟）
- [ ] 检查部署日志无错误
- [ ] 访问生成的 URL

### 步骤 5: 生产环境测试
- [ ] 访问部署的网站
- [ ] 测试用户注册
- [ ] 测试用户登录
- [ ] 测试表单功能
- [ ] 测试云同步
- [ ] 检查浏览器控制台
- [ ] 检查 Supabase dashboard 数据

---

## 🔧 其他平台部署

### Netlify
```bash
# 1. 安装 Netlify CLI
npm install -g netlify-cli

# 2. 构建项目
npm run build

# 3. 部署
netlify deploy --prod --dir=.output/public
```

环境变量配置：
- Settings > Build & Deploy > Environment variables
- 添加 SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_KEY

### Railway
1. 连接 GitHub 仓库
2. 添加环境变量
3. Deploy

---

## ✅ 部署后验证

### 功能测试清单
- [ ] 首页加载正常
- [ ] 登录页面可访问
- [ ] 注册页面可访问
- [ ] 用户可以成功注册
- [ ] 用户可以成功登录
- [ ] Dashboard 显示正常
- [ ] 表单步骤可以访问
- [ ] 数据可以保存到 localStorage
- [ ] 数据可以同步到 Supabase
- [ ] Profile 页面显示正常
- [ ] 可以创建多个草稿
- [ ] 可以在草稿间切换
- [ ] 可以删除草稿
- [ ] 登出功能正常
- [ ] 受保护路由重定向正常
- [ ] 移动端显示正常

### 性能检查
- [ ] Lighthouse 分数 > 90（Performance）
- [ ] 首屏加载 < 3 秒
- [ ] 表单响应流畅
- [ ] 无内存泄漏
- [ ] 图片优化

### 安全检查
- [ ] HTTPS 已启用
- [ ] 环境变量不在代码中
- [ ] RLS 策略正常工作
- [ ] 用户只能访问自己的数据
- [ ] JWT Token 正确存储
- [ ] 敏感 API 密钥已保护

### SEO 检查
- [ ] 页面标题正确
- [ ] Meta 描述存在
- [ ] Favicon 显示
- [ ] Sitemap 生成（可选）
- [ ] robots.txt 配置（可选）

---

## 🔍 监控设置（可选）

### Supabase Dashboard
- [ ] 启用 Database Backups
- [ ] 设置 Usage Alerts
- [ ] 查看 API Logs
- [ ] 监控 Database Performance

### Vercel Analytics（可选）
- [ ] 启用 Analytics
- [ ] 查看访问统计
- [ ] 监控构建状态

### Sentry（可选）
```bash
npm install @sentry/nuxt
```
- [ ] 配置 Sentry
- [ ] 测试错误追踪

---

## 📊 生产环境优化

### 性能优化
- [ ] 启用静态生成（SSG）对适用页面
- [ ] 图片懒加载
- [ ] 代码分割
- [ ] 启用 Gzip/Brotli 压缩
- [ ] CDN 配置（Vercel 自动）

### 数据库优化
- [ ] 添加必要的数据库索引
- [ ] 启用 Connection Pooling（Supabase Pro）
- [ ] 设置合理的 RPC 超时

### 缓存策略
- [ ] 浏览器缓存头配置
- [ ] Service Worker（可选）
- [ ] localStorage 策略

---

## 🐛 常见问题排查

### "Supabase credentials not configured"
**原因**: 环境变量未设置或格式错误

**解决**:
1. 检查 Vercel Environment Variables
2. 确认变量名拼写正确
3. 重新部署项目

### RLS Policy 错误
**原因**: 数据库策略未正确设置

**解决**:
1. 重新运行 `supabase/schema.sql`
2. 检查 Supabase SQL Editor 中的 Policies
3. 验证 `auth.uid()` 函数可用

### 用户无法注册
**原因**: Email confirmation 设置问题

**解决**:
1. Supabase Dashboard > Authentication > Settings
2. 暂时禁用 "Enable email confirmations"（开发环境）
3. 或配置 SMTP（生产环境）

### 同步不工作
**原因**: 网络问题或配额用尽

**解决**:
1. 检查浏览器 Network 标签
2. 查看控制台错误信息
3. 验证用户配额未用尽
4. 检查 Supabase API 状态

---

## 📈 后续改进建议

### 短期（1-2 周）
- [ ] 添加 Google OAuth 登录
- [ ] 优化移动端体验
- [ ] 添加表单自动填充建议
- [ ] 实现草稿标题编辑

### 中期（1 个月）
- [ ] 添加导出为 PDF 功能
- [ ] 实现版本历史记录
- [ ] 添加表单完成度检查清单
- [ ] 实现邮件提醒

### 长期（3 个月）
- [ ] 团队协作功能
- [ ] 多语言支持
- [ ] 表单模板系统
- [ ] 移动应用（React Native）

---

## ✅ 最终检查

部署成功标准：
- ✅ 网站可公开访问
- ✅ 所有核心功能正常
- ✅ 无 JavaScript 错误
- ✅ 用户可以注册和登录
- ✅ 数据可以同步到数据库
- ✅ 移动端适配良好
- ✅ 性能指标达标

---

## 🎉 部署完成！

恭喜！DS-160 Helper 已成功部署到生产环境。

**下一步**:
1. 分享网站链接
2. 收集用户反馈
3. 监控使用情况
4. 持续改进

**支持资源**:
- 📖 [完整文档](IMPLEMENTATION_COMPLETE.md)
- 🚀 [快速开始](QUICKSTART.md)
- 🗄️ [数据库设置](supabase/SETUP.md)
- 💬 问题反馈: GitHub Issues

---

**部署日期**: _______  
**部署 URL**: _______  
**负责人**: _______
