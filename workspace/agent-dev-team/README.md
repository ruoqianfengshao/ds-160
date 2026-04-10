# SaaS应用开发Agent团队

## 项目概述
使用AG2 (AutoGen)框架构建的多Agent协作开发团队，用于开发中等难度的SaaS应用（包含Chrome插件和轻量前后端）。

## 团队架构

### 核心成员
1. **Product Manager Agent (产品经理)**
   - 角色：需求分析、任务拆解、项目管理
   - 能力：理解业务需求、制定开发计划、协调团队

2. **Frontend Developer Agent (前端开发)**
   - 角色：Chrome插件开发、前端界面实现
   - 能力：React/Vue.js、Chrome Extension API、UI/UX实现

3. **Backend Developer Agent (后端开发)**
   - 角色：API开发、数据库设计、业务逻辑
   - 能力：Node.js/Python、RESTful API、数据库设计

4. **QA Engineer Agent (测试工程师)**
   - 角色：代码审查、测试用例编写、质量保证
   - 能力：单元测试、集成测试、安全审计

5. **DevOps Engineer Agent (运维工程师)**
   - 角色：CI/CD、部署、监控
   - 能力：Docker、云服务部署、性能优化

## 协作模式

### 1. 分层执行模式 (Hierarchical)
- Product Manager Agent 作为 Manager，负责任务分配和进度跟踪
- 其他Agent作为Worker，接收任务并执行

### 2. 工作流程
```
需求输入 
  ↓
Product Manager (任务拆解)
  ↓
├─ Frontend Developer (插件+前端)
├─ Backend Developer (API+数据库)
└─ QA Engineer (测试)
  ↓
DevOps Engineer (部署)
  ↓
交付成果
```

## 技术栈

### Chrome插件
- Manifest V3
- React/TypeScript
- Chrome Extension API

### 前端
- React 18+
- TypeScript
- Tailwind CSS
- Vite

### 后端
- Node.js + Express / FastAPI
- PostgreSQL / MongoDB
- JWT认证
- RESTful API

### DevOps
- Docker
- GitHub Actions
- 云服务 (AWS/阿里云)

## 快速开始

### 1. 安装依赖
```bash
pip install ag2
pip install openai anthropic
npm install -g pnpm
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入API密钥
```

### 3. 启动团队
```bash
python main.py --project "你的SaaS应用描述"
```

## 项目结构
```
agent-dev-team/
├── agents/              # Agent定义
│   ├── product_manager.py
│   ├── frontend_dev.py
│   ├── backend_dev.py
│   ├── qa_engineer.py
│   └── devops_engineer.py
├── config/              # 配置文件
│   ├── agents_config.yaml
│   └── models_config.yaml
├── workflows/           # 工作流定义
│   └── saas_development.py
├── tools/               # 工具函数
│   ├── code_executor.py
│   ├── file_manager.py
│   └── git_operations.py
├── outputs/             # 输出目录
│   ├── code/
│   ├── docs/
│   └── logs/
├── main.py              # 主入口
├── requirements.txt
└── README.md
```

## 使用示例

### 开发新功能
```python
from workflows.saas_development import SaaSDevelopmentWorkflow

# 初始化工作流
workflow = SaaSDevelopmentWorkflow()

# 定义项目需求
project_spec = """
开发一个浏览器标签页管理SaaS应用：
1. Chrome插件：保存和管理标签页分组
2. Web前端：查看和搜索已保存的标签页
3. 后端API：用户认证、数据存储、跨设备同步
"""

# 执行开发流程
result = workflow.run(project_spec)

print(result.summary)
print(result.deliverables)
```

## 优势特性

✅ **自动化任务拆解**：产品经理Agent自动将需求拆解为可执行任务
✅ **专业分工**：每个Agent专注自己的领域，提升代码质量
✅ **代码审查**：QA Agent自动进行代码审查和测试
✅ **持续集成**：DevOps Agent自动化部署和监控
✅ **可追溯性**：完整记录开发过程和决策依据

## 预期产出

### 1. Chrome插件
- manifest.json
- popup.html/popup.js
- background.js
- content_script.js
- 完整的插件代码和资源文件

### 2. 前端应用
- React组件
- 路由配置
- 状态管理
- API集成

### 3. 后端服务
- API接口文档
- 数据库schema
- 业务逻辑代码
- 认证授权模块

### 4. 部署配置
- Dockerfile
- docker-compose.yml
- CI/CD配置
- 部署文档

## 后续扩展

- [ ] 添加UI/UX Designer Agent
- [ ] 添加Security Auditor Agent
- [ ] 集成自动化测试工具
- [ ] 支持更多云服务平台
- [ ] 添加性能优化Agent

## 许可证
MIT License
