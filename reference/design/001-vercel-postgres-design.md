# 数据库方案调整 - 使用 Vercel Postgres

## 方案变更

**从 Supabase 改为 Vercel Postgres**

**理由：**
- ✅ 与 Vercel 部署无缝集成
- ✅ 免费额度：256MB 存储 + 60小时计算时间/月
- ✅ 自动连接池管理
- ✅ 边缘函数支持
- ✅ 无需额外账号配置

## Vercel Postgres 技术栈

### 1. 数据库连接

**安装依赖：**
```bash
npm install @vercel/postgres
npm install bcrypt jsonwebtoken
```

**环境变量（`.env`）：**
```env
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"

JWT_SECRET="your-secret-key-here"
```

### 2. 数据库 Schema（SQL）

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'enterprise')),
  sync_count INT DEFAULT 0,
  sync_limit INT DEFAULT 3,
  sync_reset_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- DS-160 drafts
CREATE TABLE ds160_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'DS-160 Draft',
  form_data JSONB NOT NULL DEFAULT '{}',
  current_step INT DEFAULT 1,
  completion_percentage INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_synced_at TIMESTAMP
);

-- Sync history (optional, for audit)
CREATE TABLE sync_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  draft_id UUID REFERENCES ds160_drafts(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_drafts_user_id ON ds160_drafts(user_id);
CREATE INDEX idx_drafts_updated_at ON ds160_drafts(updated_at DESC);
CREATE INDEX idx_sync_history_user_id ON sync_history(user_id);
```

### 3. API 路由实现

**使用 Nuxt Server API (`server/api/`)**

**认证中间件 (`server/middleware/auth.ts`)：**
```typescript
import jwt from 'jsonwebtoken'
import { sql } from '@vercel/postgres'

export default defineEventHandler(async (event) => {
  const protectedPaths = ['/api/drafts', '/api/user']
  
  if (!protectedPaths.some(path => event.path.startsWith(path))) {
    return
  }

  const token = getCookie(event, 'auth_token')
  
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    event.context.userId = decoded.userId
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
})
```

**API 端点列表：**
- `POST /api/auth/signup` - 注册
- `POST /api/auth/login` - 登录  
- `POST /api/auth/logout` - 登出
- `GET /api/user/profile` - 获取用户资料
- `PUT /api/user/profile` - 更新用户资料
- `GET /api/drafts` - 获取所有草稿
- `GET /api/drafts/:id` - 获取单个草稿
- `POST /api/drafts` - 创建草稿
- `PUT /api/drafts/:id` - 更新草稿
- `DELETE /api/drafts/:id` - 删除草稿
- `POST /api/drafts/:id/sync` - 同步草稿（计数）

### 4. 认证流程简化

**不使用 Supabase Auth，改用简单的 JWT：**

```typescript
// 注册
const hashedPassword = await bcrypt.hash(password, 10)
await sql`
  INSERT INTO users (email, password_hash)
  VALUES (${email}, ${hashedPassword})
`

// 登录
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
  expiresIn: '7d'
})
setCookie(event, 'auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7 // 7 days
})
```

### 5. 前端集成

**composables/useAuth.ts：**
```typescript
export const useAuth = () => {
  const user = useState('user', () => null)
  const loading = useState('authLoading', () => false)

  const login = async (email: string, password: string) => {
    const { data } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    user.value = data.user
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    navigateTo('/login')
  }

  const fetchUser = async () => {
    try {
      const { data } = await $fetch('/api/user/profile')
      user.value = data
    } catch {
      user.value = null
    }
  }

  return { user, loading, login, logout, fetchUser }
}
```

### 6. Pinia Store 改造

**保持 localStorage + 添加数据库同步：**

```typescript
// 自动保存逻辑
autoSave() {
  // 1. 立即保存到 localStorage（离线优先）
  localStorage.setItem(STORAGE_KEY, JSON.stringify(this.formData))
  
  // 2. 延迟同步到数据库（防抖）
  clearTimeout(this.syncTimer)
  this.syncTimer = setTimeout(() => {
    this.syncToDatabase()
  }, 2000)
}

async syncToDatabase() {
  if (!this.isAuthenticated) return
  
  try {
    await $fetch(`/api/drafts/${this.currentDraftId}`, {
      method: 'PUT',
      body: {
        form_data: this.formData,
        current_step: this.meta.currentStep,
        completion_percentage: this.progress
      }
    })
    this.meta.syncStatus = 'synced'
    this.meta.lastSyncAt = new Date().toISOString()
  } catch (error) {
    this.meta.syncStatus = 'error'
  }
}
```

### 7. Dashboard 改造

**加载数据库中的草稿：**

```typescript
// pages/dashboard.vue
const drafts = ref([])

onMounted(async () => {
  const { data } = await $fetch('/api/drafts')
  drafts.value = data
})
```

### 8. 环境变量配置

**Vercel Dashboard 设置：**
1. 进入项目 Settings → Environment Variables
2. 添加数据库连接变量（Vercel Postgres 自动提供）
3. 添加 `JWT_SECRET`（手动生成）

**生成 JWT Secret：**
```bash
openssl rand -base64 32
```

---

## 实现优先级（Vercel Postgres 版）

**Phase 1（核心）：**
1. 安装 @vercel/postgres 依赖
2. 创建数据库 Schema（SQL）
3. 实现认证 API（注册/登录/登出）
4. 实现草稿 CRUD API
5. 前端登录/注册页面

**Phase 2（集成）：**
6. 认证中间件
7. Pinia Store 数据库同步
8. Dashboard 草稿列表
9. 自动保存逻辑

**Phase 3（优化）：**
10. 同步配额限制
11. 错误处理
12. Loading 状态

---

**关键优势：**
- ✅ 部署后自动连接数据库（无需手动配置）
- ✅ 边缘函数支持（低延迟）
- ✅ 与 Vercel 账单统一管理
- ✅ 免费额度足够初期使用