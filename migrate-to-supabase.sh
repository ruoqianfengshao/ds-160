#!/bin/bash

# DS-160 数据库迁移脚本
# 从 Vercel Postgres 迁移到 Supabase

set -e

echo "🚀 DS-160 数据库迁移工具"
echo "=========================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查必需工具
check_requirements() {
    echo "📋 检查必需工具..."
    
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}❌ psql 未安装${NC}"
        echo "   安装方法: sudo apt-get install postgresql-client"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️  jq 未安装（可选，用于美化输出）${NC}"
    fi
    
    echo -e "${GREEN}✅ 工具检查完成${NC}"
    echo ""
}

# 步骤 1: 验证 Supabase 连接
verify_supabase() {
    echo "🔍 步骤 1/5: 验证 Supabase 配置"
    echo "================================"
    
    if [ ! -f ".env" ]; then
        echo -e "${RED}❌ .env 文件不存在${NC}"
        echo ""
        echo "请创建 .env 文件并配置 Supabase 凭证："
        echo ""
        cat << 'EOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=$(openssl rand -base64 32)
EOF
        echo ""
        exit 1
    fi
    
    source .env
    
    if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
        echo -e "${RED}❌ Supabase 凭证未配置${NC}"
        echo "   请在 .env 文件中设置 SUPABASE_URL 和 SUPABASE_KEY"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Supabase 配置已就绪${NC}"
    echo "   URL: $SUPABASE_URL"
    echo ""
}

# 步骤 2: 测试 Supabase 连接
test_supabase_connection() {
    echo "🔗 步骤 2/5: 测试 Supabase 连接"
    echo "==============================="
    
    # 测试 API 连接
    echo "测试 Supabase API..."
    
    response=$(curl -s -X GET \
        "$SUPABASE_URL/rest/v1/" \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" \
        -w "%{http_code}")
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ Supabase API 连接成功${NC}"
    else
        echo -e "${RED}❌ Supabase API 连接失败 (HTTP $http_code)${NC}"
        exit 1
    fi
    echo ""
}

# 步骤 3: 导出 Vercel Postgres 数据（如果存在）
export_vercel_data() {
    echo "📤 步骤 3/5: 导出 Vercel Postgres 数据（可选）"
    echo "============================================="
    
    if [ -z "$POSTGRES_URL" ]; then
        echo -e "${YELLOW}⚠️  未配置 POSTGRES_URL，跳过数据导出${NC}"
        echo "   如果你没有现有数据，可以忽略此步骤"
        echo ""
        return
    fi
    
    echo "导出现有数据..."
    
    mkdir -p migration_data
    
    # 导出用户表
    if psql "$POSTGRES_URL" -c "\d users" &> /dev/null; then
        echo "  导出 users 表..."
        psql "$POSTGRES_URL" -c "COPY users TO STDOUT CSV HEADER" > migration_data/users.csv
        echo -e "  ${GREEN}✅ users.csv${NC}"
    fi
    
    # 导出草稿表
    if psql "$POSTGRES_URL" -c "\d drafts" &> /dev/null; then
        echo "  导出 drafts 表..."
        psql "$POSTGRES_URL" -c "COPY drafts TO STDOUT CSV HEADER" > migration_data/drafts.csv
        echo -e "  ${GREEN}✅ drafts.csv${NC}"
    fi
    
    echo -e "${GREEN}✅ 数据导出完成${NC}"
    echo "   文件保存在: migration_data/"
    echo ""
}

# 步骤 4: 运行 Supabase 迁移
run_supabase_migration() {
    echo "🗄️  步骤 4/5: 运行 Supabase 数据库迁移"
    echo "====================================="
    
    if [ ! -f "supabase/schema.sql" ]; then
        echo -e "${RED}❌ supabase/schema.sql 文件不存在${NC}"
        exit 1
    fi
    
    echo "正在应用 schema.sql..."
    echo ""
    echo -e "${YELLOW}⚠️  请手动执行以下步骤：${NC}"
    echo ""
    echo "1. 访问: $SUPABASE_URL/project/default/sql/new"
    echo "2. 复制 supabase/schema.sql 的全部内容"
    echo "3. 粘贴到 SQL Editor"
    echo "4. 点击 'Run' 执行"
    echo ""
    echo "执行完成后，按回车继续..."
    read
    
    echo -e "${GREEN}✅ 数据库迁移完成${NC}"
    echo ""
}

# 步骤 5: 验证迁移结果
verify_migration() {
    echo "✅ 步骤 5/5: 验证迁移结果"
    echo "========================"
    
    echo "检查 Supabase 表..."
    
    # 检查 profiles 表
    response=$(curl -s -X GET \
        "$SUPABASE_URL/rest/v1/profiles?select=count" \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY")
    
    if [[ $response == *"count"* ]]; then
        echo -e "  ${GREEN}✅ profiles 表已创建${NC}"
    else
        echo -e "  ${RED}❌ profiles 表创建失败${NC}"
    fi
    
    # 检查 ds160_drafts 表
    response=$(curl -s -X GET \
        "$SUPABASE_URL/rest/v1/ds160_drafts?select=count" \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY")
    
    if [[ $response == *"count"* ]]; then
        echo -e "  ${GREEN}✅ ds160_drafts 表已创建${NC}"
    else
        echo -e "  ${RED}❌ ds160_drafts 表创建失败${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}✅ 迁移验证完成${NC}"
    echo ""
}

# 更新 Vercel 环境变量提示
update_vercel_env() {
    echo "🚀 下一步: 更新 Vercel 环境变量"
    echo "=============================="
    echo ""
    echo "在 Vercel 控制台中设置以下环境变量："
    echo ""
    echo "SUPABASE_URL=$SUPABASE_URL"
    echo "SUPABASE_KEY=$SUPABASE_KEY"
    if [ -n "$SUPABASE_SERVICE_KEY" ]; then
        echo "SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY"
    fi
    if [ -n "$JWT_SECRET" ]; then
        echo "JWT_SECRET=$JWT_SECRET"
    fi
    echo ""
    echo "或使用 Vercel CLI:"
    echo ""
    echo "vercel env add SUPABASE_URL"
    echo "vercel env add SUPABASE_KEY"
    echo "vercel env add SUPABASE_SERVICE_KEY"
    echo "vercel env add JWT_SECRET"
    echo ""
}

# 主函数
main() {
    check_requirements
    verify_supabase
    test_supabase_connection
    export_vercel_data
    run_supabase_migration
    verify_migration
    update_vercel_env
    
    echo "🎉 迁移完成！"
    echo "============"
    echo ""
    echo "后续步骤:"
    echo "1. 在 Vercel 控制台更新环境变量"
    echo "2. 重新部署应用"
    echo "3. 测试注册和登录功能"
    echo "4. 测试数据同步功能"
    echo ""
    echo "详细文档: MIGRATION_GUIDE.md"
    echo ""
}

# 运行主函数
main
