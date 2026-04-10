<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20 lg:py-32">
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-72 h-72 bg-primary-300 rounded-full opacity-20 blur-3xl"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-8">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            让签证申请更简单
          </div>
          
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            DS-160 表格
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-700">
              智能辅助填写
            </span>
          </h1>
          
          <p class="text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
            告别繁琐的英文表格！12步引导式填写，自动保存草稿，高风险字段智能提醒，让您的美国签证申请轻松又准确。
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink to="/app/dashboard" class="btn-primary text-lg px-8 py-4 shadow-lg shadow-primary-500/30">
              <span>免费开始填写</span>
              <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </NuxtLink>
            <NuxtLink to="/features" class="btn-secondary text-lg px-8 py-4">
              了解更多
            </NuxtLink>
          </div>
          
          <!-- Trust badges -->
          <div class="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>无需注册</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>数据本地存储</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>支持中断恢复</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Problem Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">填写 DS-160 的痛点</h2>
          <p class="text-xl text-gray-600">这些问题，您是否也遇到过？</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">超时丢失</h3>
            <p class="text-gray-600">官方表格20分钟不操作自动退出，填了一半全没了</p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">英文障碍</h3>
            <p class="text-gray-600">全英文界面，专业术语看不懂，不知道怎么填</p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">不知风险</h3>
            <p class="text-gray-600">不知道哪些是"雷区"字段，填错了可能影响签证结果</p>
          </div>
          
          <div class="text-center p-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">信息不一致</h3>
            <p class="text-gray-600">前后填写信息不一致，面签时被要求重新解释</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Solution Section -->
    <section class="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">我们的解决方案</h2>
          <p class="text-xl text-gray-600">专为华人用户设计，让DS-160填写变得简单</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div class="space-y-8">
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">12步引导式填写</h3>
                  <p class="text-gray-600">将复杂表格拆分为12个简单步骤，每一步只关注当前内容，不再一头雾水</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">中文友好界面</h3>
                  <p class="text-gray-600">每个字段都有中文说明和填写示例，告别翻译软件</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">高风险字段警示</h3>
                  <p class="text-gray-600">智能识别可能影响签证结果的关键字段，用橙色标注提醒您如实、谨慎填写</p>
                </div>
              </div>
              
              <div class="flex gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-2">自动保存草稿</h3>
                  <p class="text-gray-600">每一步填写自动保存到本地，随时可中断、随时可恢复，不用担心数据丢失</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="bg-white rounded-2xl shadow-2xl shadow-gray-200/50 p-6 border border-gray-100">
              <div class="flex items-center gap-2 mb-6">
                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div class="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div class="space-y-4">
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                <div class="h-3 bg-gray-200 rounded w-4/6"></div>
                <div class="mt-6 p-4 bg-warning-50 border-l-4 border-warning-500 rounded-r-lg">
                  <p class="text-sm text-warning-800">此字段涉及签证审核关键信息，请如实填写</p>
                </div>
                <div class="h-10 bg-primary-100 rounded-lg"></div>
                <div class="h-10 bg-primary-600 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Steps Preview -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">12步完成全部填写</h2>
          <p class="text-xl text-gray-600">清晰指引，每一步都有详细说明</p>
        </div>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="step in steps" :key="step.num" class="group p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors cursor-default">
            <div class="flex items-center gap-3 mb-2">
              <span class="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                {{ step.num }}
              </span>
              <span class="text-sm font-medium text-gray-900">{{ step.title }}</span>
            </div>
            <p class="text-xs text-gray-500">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-br from-primary-600 to-primary-700">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
          准备好开始您的签证申请了吗？
        </h2>
        <p class="text-xl text-primary-100 mb-10">
          免费体验12步引导式填写，让您的DS-160表格填写变得轻松简单
        </p>
        <NuxtLink to="/app/dashboard" class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
          立即开始
          <svg class="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const steps = [
  { num: 1, title: '个人信息', desc: '姓名、性别、出生日期等' },
  { num: 2, title: '护照信息', desc: '护照号码、有效期等' },
  { num: 3, title: '联系方式', desc: '地址、电话、邮箱' },
  { num: 4, title: '旅行信息', desc: '目的、行程安排' },
  { num: 5, title: '旅行伙伴', desc: '同行人信息' },
  { num: 6, title: '美国联系人', desc: '在美联系人或酒店' },
  { num: 7, title: '家庭信息', desc: '父母、配偶信息' },
  { num: 8, title: '工作教育', desc: '职业、教育背景' },
  { num: 9, title: '安全问题1', desc: '犯罪记录相关' },
  { num: 10, title: '安全问题2', desc: '恐怖主义相关' },
  { num: 11, title: '以往旅行', desc: '美国入境历史' },
  { num: 12, title: '照片确认', desc: '上传签证照片' }
]
</script>
