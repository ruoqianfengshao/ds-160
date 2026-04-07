# 保丽加科技有限公司小程序

## 项目信息

- **项目名称**: 浙江保丽加科技有限公司小程序
- **项目类型**: 微信小程序
- **开发框架**: 微信小程序原生框架
- **基础库版本**: 3.3.4

## 项目结构

```
polyjia-miniprogram/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序全局配置
├── app.wxss               # 全局样式
├── sitemap.json           # 索引配置
├── project.config.json    # 项目配置文件
├── images/                # 图片资源目录
│   └── README.md          # 图标说明
├── pages/                 # 页面目录
│   ├── index/             # 首页
│   │   ├── index.wxml
│   │   ├── index.wxss
│   │   ├── index.js
│   │   └── index.json
│   ├── about/             # 关于我们
│   │   ├── about.wxml
│   │   ├── about.wxss
│   │   ├── about.js
│   │   └── about.json
│   ├── products/          # 产品服务
│   │   ├── products.wxml
│   │   ├── products.wxss
│   │   ├── products.js
│   │   └── products.json
│   ├── news/              # 新闻中心
│   │   ├── news.wxml
│   │   ├── news.wxss
│   │   ├── news.js
│   │   └── news.json
│   └── contact/           # 联系我们
│       ├── contact.wxml
│       ├── contact.wxss
│       ├── contact.js
│       └── contact.json
├── components/            # 自定义组件目录
└── utils/                 # 工具函数目录
    └── util.js            # 通用工具函数
```

## 功能模块

### 1. 首页 (index)
- 公司 Banner 展示
- 公司简介卡片
- 核心业务展示（技术研发、生产制造、产品销售、技术支持）
- 公司动态列表
- 快速联系信息
- 一键拨号功能

### 2. 关于我们 (about)
- 公司介绍
- 企业文化（愿景、使命、核心价值观）
- 发展历程时间轴
- 荣誉资质展示

### 3. 产品服务 (products)
- 产品分类筛选（全部、核心产品、技术服务、解决方案）
- 产品列表展示
- 服务优势展示
- 产品详情（待开发）

### 4. 新闻中心 (news)
- 新闻列表展示
- 新闻分类标签
- 加载更多功能
- 新闻详情（待开发）

### 5. 联系我们 (contact)
- 联系方式展示（电话、邮箱、地址）
- 一键拨号
- 邮箱复制
- 地址复制
- 地图导航
- 在线留言表单
- 社交媒体链接

## 技术特点

- ✅ 采用微信小程序原生开发
- ✅ 响应式布局设计
- ✅ 统一的视觉风格（主色调：#1890ff）
- ✅ 模块化代码结构
- ✅ 通用工具函数封装
- ✅ 支持自动更新检测

## 待完善事项

### 高优先级
1. **TabBar 图标**: 需要准备 8 个图标文件（81x81px）
   - home.png / home-active.png
   - about.png / about-active.png
   - product.png / product-active.png
   - contact.png / contact-active.png

2. **公司信息**: 需要替换为真实信息
   - 联系电话
   - 公司地址
   - 公司邮箱
   - 地图坐标

3. **产品详情页面**: 目前点击产品显示"开发中"

4. **新闻详情页面**: 目前点击新闻显示"开发中"

### 中优先级
5. **在线留言后端对接**: 目前留言只是模拟提交

6. **数据动态化**: 将硬编码的数据改为从后端 API 获取

7. **用户登录**: 添加微信登录功能

8. **分享功能**: 添加小程序分享能力

### 低优先级
9. **客服功能**: 接入微信客服

10. **数据统计**: 接入小程序数据分析

## 开发指南

### 环境准备
1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开微信开发者工具
3. 导入项目（选择 `polyjia-miniprogram` 目录）
4. 填写 AppID（测试可选用测试号）

### 运行项目
1. 在微信开发者工具中点击"编译"
2. 选择预览设备型号
3. 查看运行效果

### 修改配置
- **AppID**: 修改 `project.config.json` 中的 `appid` 字段
- **公司名称**: 修改 `app.js` 中的 `globalData`
- **主题色**: 修改 `app.wxss` 中的颜色值

## 下一步建议

1. **准备图标素材** - 让小程序更美观
2. **确认公司信息** - 替换所有占位信息
3. **规划产品详情页** - 确定展示内容和交互
4. **考虑后端需求** - 是否需要后台管理系统

---

**最后更新**: 2026-03-26
**状态**: 基础功能已完成，可运行
