"""
DS-160 Helper MVP开发 - Agent团队主入口
使用AG2 (AutoGen)框架构建多Agent协作系统
"""

import os
import subprocess
from typing import Dict, List
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 配置 - 使用Erda代理的Claude Sonnet
config_list = [
    {
        "model": os.getenv("ERDA_MODEL", "anthropic/us.anthropic.claude-sonnet-4-5-20250929-v1:0"),
        "api_key": os.getenv("ERDA_API_KEY"),
        "base_url": os.getenv("ERDA_BASE_URL", "https://ai-proxy.erda.cloud/v1"),
        "api_type": "openai"  # Erda使用OpenAI兼容API
    }
]

llm_config = {
    "config_list": config_list,
    "temperature": 0.7,
    "timeout": 600  # 增加超时时间到10分钟
}


def push_to_github(work_dir: str):
    """将生成的代码推送到GitHub"""
    try:
        github_token = os.getenv("GITHUB_TOKEN")
        github_repo = os.getenv("GITHUB_REPO")
        github_user = os.getenv("GITHUB_USER", "ruoqianfengshao")
        
        if not github_token or not github_repo:
            print("⚠️  GitHub配置缺失，跳过推送")
            return False
        
        # 创建带token的repo URL
        repo_url_with_token = github_repo.replace(
            "https://",
            f"https://{github_user}:{github_token}@"
        )
        
        print("\n" + "=" * 80)
        print("📤 推送代码到GitHub...")
        print("=" * 80)
        
        os.chdir(work_dir)
        
        # Git操作
        commands = [
            "git init",
            "git add .",
            'git commit -m "Initial commit: DS-160 Helper MVP by AG2 Team"',
            f"git branch -M main",
            f"git remote add origin {repo_url_with_token}",
            "git push -u origin main --force"  # 强制推送（如果仓库已存在）
        ]
        
        for cmd in commands:
            # 隐藏token（安全）
            display_cmd = cmd.replace(github_token, "***TOKEN***")
            print(f"$ {display_cmd}")
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            
            if result.returncode != 0 and "already exists" not in result.stderr:
                print(f"⚠️  命令执行警告: {result.stderr}")
        
        print("\n✅ 代码已推送到GitHub!")
        print(f"🔗 查看仓库: {github_repo}")
        print("=" * 80)
        return True
        
    except Exception as e:
        print(f"\n❌ GitHub推送失败: {str(e)}")
        return False


class SaaSDevelopmentTeam:
    """SaaS应用开发Agent团队"""
    
    def __init__(self):
        self.agents = {}
        self._initialize_agents()
        
    def _initialize_agents(self):
        """初始化所有Agent"""
        
        # 1. 产品经理Agent
        self.agents['product_manager'] = AssistantAgent(
            name="ProductManager",
            system_message="""你是一位资深产品经理。
你的职责：
1. 理解和分析用户需求
2. 将需求拆解为具体的开发任务
3. 制定开发计划和优先级
4. 协调团队成员，跟踪项目进度
5. 确保最终产品符合需求

工作方式：
- 先理解完整需求，提出澄清问题
- 将需求拆解为前端开发任务
- 为每个模块制定详细的功能清单
- 协调各开发人员并行工作
- 最后整合所有模块

输出格式：
1. 需求分析
2. 功能清单（分模块）
3. 开发计划
4. 里程碑
""",
            llm_config=llm_config
        )
        
        # 2. 前端开发Agent（Nuxt 3专家）
        self.agents['frontend_dev'] = AssistantAgent(
            name="FrontendDeveloper",
            system_message="""你是一位资深Nuxt 3全栈开发工程师。

技能栈：
- Nuxt 3 + Vue 3 + TypeScript
- Tailwind CSS v4
- Pinia状态管理
- SSR/CSR混合架构
- 响应式设计

你的职责：
1. 搭建Nuxt 3项目结构
2. 实现营销页面（SSR）：首页、功能介绍、定价
3. 实现应用页面（CSR）：表单填写、草稿管理
4. 实现12步表单引导系统
5. 实现localStorage草稿保存
6. 高风险字段提示UI

输出规范：
- 完整的Nuxt 3项目代码
- 清晰的目录结构
- TypeScript类型定义
- 详细注释
- README with 运行命令

交付物必须包含：
- package.json
- nuxt.config.ts
- pages/ 目录（所有页面）
- components/ 目录（所有组件）
- composables/ 目录（可复用逻辑）
- stores/ 目录（Pinia stores）
- README.md
""",
            llm_config=llm_config
        )
        
        # 3. QA工程师Agent
        self.agents['qa_engineer'] = AssistantAgent(
            name="QAEngineer",
            system_message="""你是一位资深QA工程师。

你的职责：
1. 代码审查：检查代码质量、最佳实践
2. 功能完整性检查：确保所有需求都实现
3. 用户体验审查：检查UI/UX问题
4. 安全审计：检查潜在安全问题

审查重点：
- Nuxt 3配置是否正确
- TypeScript类型是否完整
- 组件是否模块化
- 错误处理是否完善
- 响应式设计是否合理

输出：
- 代码审查报告
- 问题清单（按优先级）
- 改进建议
""",
            llm_config=llm_config
        )
        
        # 4. DevOps工程师Agent
        self.agents['devops_engineer'] = AssistantAgent(
            name="DevOpsEngineer",
            system_message="""你是一位资深DevOps工程师。

你的职责：
1. 提供部署文档
2. 编写docker-compose.yml（如需要）
3. 提供运行和构建命令
4. 环境配置说明

输出：
- README.md更新（部署部分）
- .env.example
- 运行命令说明
- 构建和部署步骤
""",
            llm_config=llm_config
        )
        
        # 5. 用户代理
        self.agents['user_proxy'] = UserProxyAgent(
            name="User",
            human_input_mode="NEVER",  # 改为NEVER，完全自动化
            max_consecutive_auto_reply=0,
            is_termination_msg=lambda x: x.get("content", "").strip().endswith("TERMINATE"),
            code_execution_config={
                "work_dir": "outputs/ds160-helper",
                "use_docker": False
            }
        )
    
    def create_workflow(self, project_description: str) -> tuple:
        """创建开发工作流"""
        
        # 定义Agent参与顺序
        agents = [
            self.agents['user_proxy'],
            self.agents['product_manager'],
            self.agents['frontend_dev'],
            self.agents['qa_engineer'],
            self.agents['devops_engineer']
        ]
        
        # 创建群聊
        groupchat = GroupChat(
            agents=agents,
            messages=[],
            max_round=15,  # 减少到15轮，避免过长
            speaker_selection_method="round_robin",
            allow_repeat_speaker=False  # 防止同一个agent连续说话
        )
        
        # 创建管理者
        manager = GroupChatManager(
            groupchat=groupchat,
            llm_config=llm_config
        )
        
        return groupchat, manager
    
    def run(self, project_description: str):
        """执行开发流程"""
        
        print("=" * 80)
        print("🚀 DS-160 Helper MVP开发 - AG2团队启动")
        print("=" * 80)
        print(f"\n项目需求：\n{project_description}\n")
        print("=" * 80)
        
        # 创建工作流
        groupchat, manager = self.create_workflow(project_description)
        
        # 初始化对话
        initial_message = f"""
【项目需求】
{project_description}

【开发流程】
1. Product Manager: 分析需求，拆解任务
2. Frontend Developer: 开发完整的Nuxt 3应用
3. QA Engineer: 代码审查和功能检查
4. DevOps Engineer: 部署文档和运行说明

请按顺序开始工作。Product Manager先进行需求分析和任务拆解。

【重要】Frontend Developer必须生成完整可运行的代码文件，包括：
- package.json
- nuxt.config.ts
- 所有页面文件（pages/）
- 所有组件文件（components/）
- Pinia stores（stores/）
- README.md

代码必须写入到 outputs/ds160-helper/ 目录。
"""
        
        # 启动协作
        self.agents['user_proxy'].initiate_chat(
            manager,
            message=initial_message
        )
        
        print("\n" + "=" * 80)
        print("✅ 开发流程完成！")
        print("=" * 80)
        
        # 推送到GitHub
        work_dir = "outputs/ds160-helper"
        if os.path.exists(work_dir):
            push_to_github(work_dir)
        else:
            print(f"⚠️  工作目录 {work_dir} 不存在，跳过GitHub推送")


def main():
    """主函数"""
    
    # DS-160 Helper MVP项目描述
    project_description = """
开发 DS-160 Helper MVP - 美国签证DS-160申请表辅助填写工具

【技术栈】
- 框架：Nuxt 3 + Vue 3 + TypeScript
- 样式：Tailwind CSS v4
- 状态管理：Pinia
- 构建：Vite 8

【核心功能】
1. 营销页面（SSR）
   - 首页（/）：产品介绍、核心卖点
   - 功能介绍（/features）：12步引导、高风险提示等
   - 定价页（/pricing）：免费版/个人版/家庭版对比

2. 应用页面（CSR，/app/*）
   - 用户面板（/app/dashboard）：草稿列表
   - 表单填写（/app/form/step-[1-12]）：12个步骤的表单
     * Step 1: 个人信息
     * Step 2: 护照信息
     * Step 3: 联系方式
     * Step 4: 旅行信息
     * Step 5: 旅行伙伴
     * Step 6: 美国联系人
     * Step 7: 家庭信息
     * Step 8: 工作/教育
     * Step 9: 安全问题(1)
     * Step 10: 安全问题(2)
     * Step 11: 以往旅行
     * Step 12: 照片上传与确认
   - 草稿管理（/app/drafts）：查看和恢复草稿

3. 关键特性
   - 草稿自动保存到localStorage
   - 每个字段有中文说明和填写建议
   - 高风险字段用橙色警告框标注
   - 实时表单校验
   - 进度追踪（已完成X/12步）
   - 模拟同步功能（计数，剩余X次）
   - 响应式设计（移动端友好）

【路由配置】
- SSR页面：/, /features, /pricing
- CSR页面：/app/**

【数据结构】
Draft接口：
- id: string
- createdAt: Date
- updatedAt: Date
- currentStep: number (1-12)
- syncCount: number (已使用的同步次数，免费版限3次)
- data: object (各步骤的表单数据)

【UI要求】
- 简洁现代的设计风格
- 使用Tailwind CSS v4
- 高风险字段：橙色边框 + 警告图标 + 提示文字
- 步骤导航：左侧边栏，显示进度
- 移动端：响应式布局，适配小屏幕

【MVP范围】
✅ 包含：营销页、表单填写、草稿管理、模拟同步
❌ 不包含：真实登录、后端API、支付、Chrome插件、真实DS-160同步

请生成完整可运行的Nuxt 3项目代码。
"""
    
    # 初始化团队
    team = SaaSDevelopmentTeam()
    
    # 执行开发
    team.run(project_description)


if __name__ == "__main__":
    main()
