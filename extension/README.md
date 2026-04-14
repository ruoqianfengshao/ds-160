# DS-160 Chrome Extension

🚀 **自动填充 DS-160 表单的浏览器插件**

## 功能特性

### ✅ 核心功能
- 📝 **自动填充** - 一键填充已保存的表单数据
- 💾 **智能保存** - 自动保存当前表单进度
- 📊 **多草稿管理** - 支持保存多个步骤的数据
- 🔄 **自动同步** - 每 5 分钟自动保存（可配置）
- 🎯 **步骤检测** - 自动识别当前表单步骤
- ⚡ **即时提示** - 页面加载时显示激活状态

### 🛡️ 安全特性
- 🔒 所有数据本地存储（chrome.storage.local）
- 🚫 不上传任何数据到外部服务器
- ✅ 仅在 DS-160 官网激活（ceac.state.gov）

## 安装方法

### 方式 1: 开发者模式安装（推荐）

1. **下载代码**
   ```bash
   git clone https://github.com/ruoqianfengshao/ds-160.git
   cd ds-160/extension
   ```

2. **打开 Chrome 扩展页面**
   - 访问 `chrome://extensions/`
   - 或点击 Chrome 菜单 → 更多工具 → 扩展程序

3. **启用开发者模式**
   - 点击右上角「开发者模式」开关

4. **加载扩展**
   - 点击「加载已解压的扩展程序」
   - 选择 `ds-160/extension` 文件夹

5. **完成**
   - 扩展图标将出现在工具栏
   - 访问 DS-160 网站时自动激活

### 方式 2: 从 Chrome 网上应用店安装

_即将推出..._

## 使用指南

### 1. 首次使用

1. 访问 [DS-160 官网](https://ceac.state.gov/genniv/)
2. 开始填写表单
3. 点击扩展图标，查看状态

### 2. 保存进度

**手动保存：**
- 点击扩展图标
- 点击「保存当前进度」按钮
- 确认保存成功提示

**自动保存：**
- 插件每 5 分钟自动保存
- 无需手动操作

### 3. 自动填充

1. 打开需要填充的表单步骤
2. 点击扩展图标
3. 点击「自动填充表单」
4. 系统自动填充已保存的数据

### 4. 管理草稿

- 点击「加载已保存草稿」查看所有保存的步骤
- 每个步骤独立保存，互不干扰
- 可随时清除所有数据

## 目录结构

```
extension/
├── manifest.json           # 扩展配置文件
├── popup.html             # 弹出窗口界面
├── scripts/
│   ├── background.js      # 后台服务
│   ├── content.js         # 内容脚本（注入到页面）
│   └── popup.js           # 弹出窗口逻辑
├── styles/
│   └── content.css        # 注入页面的样式
├── icons/
│   ├── icon16.png         # 16x16 图标
│   ├── icon48.png         # 48x48 图标
│   └── icon128.png        # 128x128 图标
├── tests/
│   └── extension.test.js  # 单元测试
└── README.md              # 本文档
```

## 开发指南

### 测试

```bash
# 安装依赖
npm install --save-dev jest

# 运行测试
npm test

# 测试覆盖率
npm run test:coverage
```

### 构建

```bash
# 打包扩展
npm run build

# 生成 .zip 文件用于发布
npm run package
```

### 调试

1. **调试 Popup**
   - 右键点击扩展图标 → 检查弹出内容

2. **调试 Content Script**
   - 在 DS-160 页面按 F12 → Console
   - 查找 `[DS-160 Helper]` 前缀的日志

3. **调试 Background**
   - 访问 `chrome://extensions/`
   - 点击「Service Worker」链接

## 测试覆盖

### ✅ 已测试功能

- [x] 页面类型检测
- [x] 表单数据提取
- [x] 表单字段填充
- [x] 本地存储管理
- [x] 消息传递机制

### 测试用例统计

- **总计**: 5+ 测试套件
- **表单提取**: 测试覆盖所有字段类型
- **数据填充**: 验证填充准确性
- **存储操作**: 保存/读取/清除

## 常见问题

### Q: 插件不工作？
A: 确保：
1. 在 DS-160 官网（ceac.state.gov）
2. 已授予必要权限
3. 查看控制台是否有错误

### Q: 数据存储在哪里？
A: 所有数据存储在 Chrome 本地存储（chrome.storage.local），不会上传到任何服务器。

### Q: 如何删除保存的数据？
A: 点击「清除所有数据」按钮，或在 Chrome 设置中清除扩展数据。

### Q: 支持其他浏览器吗？
A: 目前仅支持 Chrome。未来计划支持 Edge、Firefox。

## 路线图

### v1.0.0 (当前版本)
- [x] 基础表单填充
- [x] 本地数据存储
- [x] 自动保存
- [x] 步骤检测

### v1.1.0 (计划中)
- [ ] 云端同步（可选）
- [ ] 数据导入/导出
- [ ] 多语言支持
- [ ] 深色模式

### v2.0.0 (未来)
- [ ] AI 辅助填写
- [ ] 表单验证提示
- [ ] 错误检测
- [ ] 进度可视化

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

- GitHub: https://github.com/ruoqianfengshao/ds-160
- Issues: https://github.com/ruoqianfengshao/ds-160/issues
