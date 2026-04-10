<template>
  <div>
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-primary-50 to-primary-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl text-center mx-auto">
          <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            简单透明的定价
          </h1>
          <p class="text-xl text-gray-600">
            选择适合您的方案，让签证申请更简单
          </p>
        </div>
      </div>
    </section>
    
    <!-- Pricing Cards -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <!-- Free Tier -->
          <div class="card border-2 border-gray-200">
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">免费版</h3>
              <div class="flex items-baseline justify-center">
                <span class="text-4xl font-bold text-gray-900">¥0</span>
                <span class="text-gray-500 ml-2">/永久</span>
              </div>
            </div>
            
            <p class="text-gray-600 text-center mb-6">
              适合首次体验，了解产品功能
            </p>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">完整的12步表单填写</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">本地草稿保存</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">3次模拟同步体验</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">高风险字段警示</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-400">云端同步</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-400">Chrome浏览器插件</span>
              </li>
            </ul>
            
            <NuxtLink to="/app/dashboard" class="btn-secondary w-full justify-center">
              免费开始
            </NuxtLink>
          </div>
          
          <!-- Personal Tier -->
          <div class="card border-2 border-primary-600 relative shadow-xl shadow-primary-500/10">
            <div class="absolute -top-4 left-1/2 -translate-x-1/2">
              <span class="inline-flex items-center px-4 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                推荐
              </span>
            </div>
            
            <div class="text-center mb-6 pt-2">
              <h3 class="text-xl font-bold text-gray-900 mb-2">个人版</h3>
              <div class="flex items-baseline justify-center">
                <span class="text-4xl font-bold text-primary-600">¥79</span>
                <span class="text-gray-500 ml-2">/年</span>
              </div>
            </div>
            
            <p class="text-gray-600 text-center mb-6">
              适合经常赴美的商务人士和旅行者
            </p>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600"><strong>无限</strong>草稿数量</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600"><strong>无限</strong>同步次数</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">云端自动同步</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">续签复制历史数据</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">优先客服支持</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="MM6 18L18 6M6 6l12 12" />
                </svg>
                <span class="text-gray-400">Chrome浏览器插件</span>
              </li>
            </ul>
            
            <button disabled class="btn-primary w-full justify-center opacity-50 cursor-not-allowed">
              即将推出
            </button>
          </div>
          
          <!-- Family Tier -->
          <div class="card border-2 border-gray-200">
            <div class="text-center mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">家庭版</h3>
              <div class="flex items-baseline justify-center">
                <span class="text-4xl font-bold text-gray-900">¥149</span>
                <span class="text-gray-500 ml-2">/年</span>
              </div>
            </div>
            
            <p class="text-gray-600 text-center mb-6">
              适合全家多人同时申请签证
            </p>
            
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600"><strong>5人</strong>无限使用</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600"><strong>无限</strong>同步次数</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">云端自动同步</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">续签复制历史数据</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">专属客服支持</span>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <span class="text-gray-600">Chrome浏览器插件</span>
              </li>
            </ul>
            
            <button disabled class="btn-secondary w-full justify-center opacity-50 cursor-not-allowed">
              即将推出
            </button>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FAQ -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">常见问题</h2>
        </div>
        
        <div class="space-y-6">
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">免费版和付费版有什么区别？</h3>
            <p class="text-gray-600">
              免费版提供完整的12步表单填写功能，但仅支持本地存储（浏览器）保存草稿，且仅有3次模拟同步体验。付费版本将支持云端同步、无限同步次数、续签数据复用等高级功能。
            </p>
          </div>
          
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">模拟同步是什么？</h3>
            <p class="text-gray-600">
              MVP阶段我们暂不连接真实的DS-160官网。模拟同步会让您体验完整的"同步到官网"的交互流程，用于收集用户反馈和迭代产品。真实同步功能将在后续版本中实现。
            </p>
          </div>
          
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">我的数据安全吗？</h3>
            <p class="text-gray-600">
              免费版的所有数据都存储在您本地的浏览器中，我们不会上传任何个人信息。付费版本的云端同步将采用加密传输，确保您的数据安全。
            </p>
          </div>
          
          <div class="bg-white rounded-xl p-6 border border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">如何续签/复用历史数据？</h3>
            <p class="text-gray-600">
              续签功能（个人版/家庭版专属）可以让您一键导入上一次申请的数据，只需更新变更的信息，大大节省填写时间。
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          立即开始您的签证申请
        </h2>
        <p class="text-xl text-gray-600 mb-10">
          免费版即可完成完整的12步表单填写
        </p>
        <NuxtLink to="/app/dashboard" class="btn-primary text-lg px-8 py-4">
          立即开始
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
</script>
