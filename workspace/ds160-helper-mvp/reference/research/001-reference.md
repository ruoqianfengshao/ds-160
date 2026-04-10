# 竞品分析与市场定位

## 主要竞品

### DS160.io
- **定价**：$10/次，$50/年
- **优势**：价格低、功能成熟
- **劣势**：无中文界面、界面简陋
- **技术**：Web应用 + 自动注入

### 走啦 (Zoular)
- **定价**：¥99-199/次
- **优势**：全中文、OCR识别、人工审核
- **劣势**：定价高、无自动注入插件
- **技术**：中文Web应用 + 人工服务

## 我们的差异化优势

1. **价格竞争力**：¥79/年 vs DS160.io $50（¥350）vs 走啦¥99+
2. **本地化**：完整中文界面 + 中文字段说明
3. **智能提示**：高风险字段标注（竞品缺少）
4. **用户体验**：12步引导 + 实时校验 + 自动保存

## 目标用户画像

### 主要用户
- **年龄**：25-45岁
- **场景**：B1/B2旅游签证、F1学生签证、J1学者签证
- **痛点**：
  - 20分钟超时，数据丢失
  - 法律英文晦涩难懂
  - 不知道哪些字段是"雷区"
  - 填错了也不知道

### 次要用户
- **家庭申请**：一家多人同时申请
- **续签用户**：需要复用历史数据

## 技术架构参考

### Nuxt 3项目结构建议
```
ds160-helper-mvp/
├── pages/
│   ├── index.vue              # 首页（SSR）
│   ├── features.vue           # 功能介绍（SSR）
│   ├── pricing.vue            # 定价页（SSR）
│   └── app/
│       ├── dashboard.vue      # 用户面板（CSR）
│       ├── drafts.vue         # 草稿列表（CSR）
│       └── form/
│           └── [step].vue     # 动态路由 step-1 到 step-12
├── components/
│   ├── landing/               # 营销页组件
│   ├── form/                  # 表单组件
│   │   ├── FormField.vue
│   │   ├── HighRiskWarning.vue
│   │   └── StepNavigation.vue
│   └── shared/                # 通用组件
├── composables/
│   ├── useDraft.ts           # 草稿管理
│   └── useFormValidation.ts  # 表单校验
├── stores/
│   └── form.ts               # Pinia store
└── nuxt.config.ts
```

### 关键技术点

1. **路由配置**（nuxt.config.ts）
```typescript
routeRules: {
  '/app/**': { ssr: false },  // 应用端CSR
  '/': { prerender: true },    // 首页SSR
}
```

2. **草稿存储**（composables/useDraft.ts）
```typescript
// 使用localStorage
const saveDraft = (draft: Draft) => {
  localStorage.setItem('ds160-draft', JSON.stringify(draft))
}

const loadDraft = (): Draft | null => {
  const data = localStorage.getItem('ds160-draft')
  return data ? JSON.parse(data) : null
}
```

3. **高风险字段配置**
```typescript
const HIGH_RISK_FIELDS = [
  'criminalRecord',
  'previousDenial',
  'socialMedia',
  'terrorismRelated',
]
```

## 用户体验流程

### 首次访问
1. 访问首页 → 查看功能介绍
2. 点击"开始填写" → 跳转到 /app/dashboard
3. 点击"新建申请" → 进入 /app/form/step-1
4. 逐步完成12个步骤
5. 每步自动保存到localStorage
6. 完成后点击"同步到DS-160官网"
7. 显示"已同步（剩余2次）"

### 中断后恢复
1. 访问 /app/dashboard
2. 看到未完成的草稿
3. 点击"继续填写" → 自动跳转到上次中断的步骤

## 关键体验细节

### 填写引导
- 每个字段下方显示灰色小字："例如：张三"
- 高风险字段显示橙色警告框："⚠️ 此字段影响签证结果，请如实填写"
- 字段间依赖关系：如回答"是"则展开子字段

### 进度追踪
- 顶部显示进度条："步骤 3/12 | 已完成 25%"
- 左侧步骤导航显示完成状态：✓（已完成）、●（当前）、○（未开始）

### 同步体验（模拟）
虽然MVP不真的连接DS-160官网，但要让用户感受到"同步"的过程：
1. 点击"同步到DS-160官网"
2. 显示加载动画："正在连接DS-160官网..."
3. 2秒后显示"✓ 同步成功"
4. 同步次数-1："剩余2次免费同步"
5. 提示："您可以继续修改，再次同步需要升级个人版"