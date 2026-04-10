<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-gray-900">DS-160 Helper</span>
          </NuxtLink>
          
          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <NuxtLink 
              to="/" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              active-class="text-primary-600"
            >
              首页
            </NuxtLink>
            <NuxtLink 
              to="/features" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              active-class="text-primary-600"
            >
              功能介绍
            </NuxtLink>
            <NuxtLink 
              to="/pricing" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              active-class="text-primary-600"
            >
              定价
            </NuxtLink>
          </nav>
          
          <!-- CTA Button -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/app/dashboard" class="btn-primary">
              开始使用
            </NuxtLink>
          </div>
          
          <!-- Mobile Menu Button -->
          <button 
            class="md:hidden p-2 text-gray-600"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100">
        <div class="px-4 py-4 space-y-3">
          <NuxtLink to="/" class="block text-gray-600 hover:text-gray-900 font-medium py-2">首页</NuxtLink>
          <NuxtLink to="/features" class="block text-gray-600 hover:text-gray-900 font-medium py-2">功能介绍</NuxtLink>
          <NuxtLink to="/pricing" class="block text-gray-600 hover:text-gray-900 font-medium py-2">定价</NuxtLink>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    
    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-400 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="col-span-1 md:col-span-2">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-white">DS-160 Helper</span>
            </div>
            <p class="text-sm leading-relaxed">
              美国签证申请表辅助填写工具，帮助您更轻松、更准确地完成 DS-160 表格填写。
            </p>
          </div>
          
          <div>
            <h4 class="text-white font-medium mb-4">产品</h4>
            <ul class="space-y-2 text-sm">
              <li><NuxtLink to="/features" class="hover:text-white transition-colors">功能介绍</NuxtLink></li>
              <li><NuxtLink to="/pricing" class="hover:text-white transition-colors">定价方案</NuxtLink></li>
            </ul>
          </div>
          
          <div>
            <h4 class="text-white font-medium mb-4">帮助</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#" class="hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#" class="hover:text-white transition-colors">使用指南</a></li>
              <li><a href="#" class="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
        </div>
        
        <div class="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>DS-160 Helper - 让签证申请更简单</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
</script>
