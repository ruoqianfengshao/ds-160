#!/bin/bash

# DS-160 真实申请测试脚本
# 运行真实的端到端测试，验证表单填写和数据同步

set -e

echo "🚀 开始运行 DS-160 真实申请测试"
echo "================================"
echo ""

# 检查依赖
echo "📦 检查依赖..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    exit 1
fi

# 安装依赖（如果需要）
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 运行单个真实测试
echo ""
echo "🧪 运行真实申请测试..."
echo "测试用例：张伟，30岁软件工程师，赴美旅游14天"
echo ""

npx playwright test tests/e2e/realistic-application.spec.ts \
  --project=chromium \
  --reporter=list \
  --timeout=300000

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ 测试通过！"
    echo ""
    echo "验证项目："
    echo "  ✅ 完整填写12步表单"
    echo "  ✅ 数据自动保存到 localStorage"
    echo "  ✅ 表单验证正常工作"
    echo "  ✅ 步骤导航功能正常"
    echo ""
    echo "📊 查看测试报告："
    echo "  npx playwright show-report"
else
    echo "❌ 测试失败（退出码: $TEST_EXIT_CODE）"
    echo ""
    echo "可能原因："
    echo "  1. 网络问题（Vercel 访问受限） - 可忽略"
    echo "  2. 页面结构变化 - 需要更新选择器"
    echo "  3. 测试超时 - 增加 timeout 设置"
    echo ""
    echo "📊 查看详细报告："
    echo "  npx playwright show-report"
fi

exit $TEST_EXIT_CODE
