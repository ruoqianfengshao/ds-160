#!/bin/bash

echo "================================"
echo "SaaS应用开发Agent团队 - 快速启动"
echo "================================"

# 1. 检查Python版本
echo "检查Python版本..."
python3 --version

# 2. 创建虚拟环境
echo "创建虚拟环境..."
python3 -m venv venv

# 3. 激活虚拟环境
echo "激活虚拟环境..."
source venv/bin/activate

# 4. 升级pip
echo "升级pip..."
pip install --upgrade pip

# 5. 安装依赖
echo "安装依赖..."
pip install -r requirements.txt

# 6. 复制环境变量配置
if [ ! -f .env ]; then
    echo "创建.env文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，填入你的API密钥"
fi

# 7. 创建输出目录
echo "创建输出目录..."
mkdir -p outputs/code
mkdir -p outputs/docs
mkdir -p outputs/logs

echo ""
echo "================================"
echo "✅ 环境准备完成！"
echo "================================"
echo ""
echo "下一步："
echo "1. 编辑 .env 文件，填入API密钥"
echo "2. 运行: python main.py"
echo ""
