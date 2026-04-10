# 快速开始指南

## 📋 准备工作

### 1. 克隆项目
```bash
cd ~/workspace/agent/workspace
# 项目已在 agent-dev-team/ 目录
```

### 2. 运行安装脚本
```bash
cd agent-dev-team
chmod +x setup.sh
./setup.sh
```

### 3. 配置API密钥
编辑 `.env` 文件，填入你的API密钥：
```bash
ANTHROPIC_API_KEY=sk-ant-xxx...
# 或者
OPENAI_API_KEY=sk-xxx...
```

## 🚀 启动开发团队

### 方式一：使用默认示例项目
```bash
python main.py
```

### 方式二：自定义项目
编辑 `main.py` 中的 `project_description` 变量，描述你的SaaS应用需求。

## 📝 项目需求模板

```python
project_description = """
开发一个[应用名称]

核心功能：
1. Chrome插件功能
   - [功能1]
   - [功能2]
   - [功能3]

2. Web管理界面
   - [功能1]
   - [功能2]
   - [功能3]

3. 后端API
   - [功能1]
   - [功能2]
   - [功能3]

技术要求：
- Chrome插件：[技术栈]
- 前端：[技术栈]
- 后端：[技术栈]
- 部署：[方案]

预期用户规模：[数量]
"""
```

## 🎯 Agent团队工作流程

1. **Product Manager** 分析需求，拆解任务
2. **Frontend Developer** 开发Chrome插件和Web前端
3. **Backend Developer** 开发后端API和数据库
4. **QA Engineer** 代码审查和测试
5. **DevOps Engineer** 容器化和部署配置

## 📦 预期产出

所有代码和文档将输出到 `outputs/` 目录：

```
outputs/
├── code/
│   ├── chrome-extension/    # Chrome插件代码
│   ├── frontend/             # Web前端代码
│   ├── backend/              # 后端API代码
│   └── deployment/           # 部署配置
├── docs/
│   ├── requirements.md       # 需求文档
│   ├── api-docs.md          # API文档
│   ├── deployment.md        # 部署文档
│   └── testing.md           # 测试文档
└── logs/                     # 执行日志
```

## 🔧 高级配置

### 自定义Agent配置
编辑 `main.py` 中的Agent `system_message` 来调整Agent的行为和技能。

### 调整协作模式
修改 `GroupChat` 的 `speaker_selection_method`：
- `"round_robin"`: 轮询（按顺序）
- `"auto"`: 自动选择（由LLM决定）
- `"manual"`: 手动选择

### 修改模型
编辑 `config_list` 选择不同的AI模型：
```python
config_list = [
    {
        "model": "gpt-4-turbo",  # 或其他模型
        "api_key": os.getenv("OPENAI_API_KEY"),
        "api_type": "openai"
    }
]
```

## ⚠️ 注意事项

1. **API成本**：多Agent协作会产生较多API调用，注意成本控制
2. **超时设置**：复杂项目可能需要增加 `timeout` 值
3. **代码审查**：AI生成的代码需要人工审查和测试
4. **安全检查**：部署前务必进行安全审计

## 🐛 常见问题

### Q: Agent运行超时？
A: 增加 `llm_config` 中的 `timeout` 值，或减少 `max_round`。

### Q: 输出代码不完整？
A: 增加 `max_round` 或在 `system_message` 中强调"必须输出完整代码"。

### Q: Agent协作混乱？
A: 使用 `"round_robin"` 模式确保顺序执行，或优化 `system_message`。

## 📚 参考资源

- [AG2 官方文档](https://ag2.ai/docs)
- [AutoGen GitHub](https://github.com/microsoft/autogen)
- [Chrome Extension 文档](https://developer.chrome.com/docs/extensions/)

## 🆘 需要帮助？

如果遇到问题，可以：
1. 查看 `outputs/logs/` 中的日志
2. 调整 `system_message` 优化Agent行为
3. 减少项目复杂度，分阶段开发
