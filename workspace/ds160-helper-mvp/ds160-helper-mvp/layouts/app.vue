<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Top Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="px-4 sm:px-6 lg:px-8">
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
          
          <!-- Nav Links -->
          <nav class="hidden md:flex items-center gap-6">
            <NuxtLink 
              to="/app/dashboard" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              active-class="text-primary-600"
            >
              我的申请
            </NuxtLink>
            <NuxtLink 
              to="/app/drafts" 
              class="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              active-class="text-primary-600"
            >
              草稿箱
            </NuxtLink>
          </nav>
          
          <!-- Right Side -->
          <div class="flex items-center gap-4">
            <!-- Save Status -->
            <div v-if="saveStatus" class="hidden sm:flex items-center gap-2 text-sm">
              <svg v-if="saveStatus === 'saving'" class="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else-if="saveStatus === 'saved'" class="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span :class="{
                'text-gray-400': saveStatus === 'saving',
                'text-green-600': saveStatus === 'saved',
                'text-red-500': saveStatus === 'error'
              }">
                {{ saveStatusText }}
              </span>
            </div>
            
            <!-- Sync Count -->
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm">
              <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="text-gray-600">剩余 <strong class="text-primary-600">{{ syncRemaining }}</strong> 次同步</span>
            </div>
            
            <!-- Mobile Menu -->
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
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100">
        <div class="px-4 py-4 space-y-3">
          <NuxtLink to="/app/dashboard" class="block text-gray-600 hover:text-gray-900 font-medium py-2">我的申请</NuxtLink>
          <NuxtLink to="/app/drafts" class="block text-gray-600 hover:text-gray-900 font-medium py-2">草稿箱</NuxtLink>
          <div class="pt-2 border-t border-gray-100">
            <div class="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
              <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span class="text-gray-600">剩余 <strong class="text-primary-600">{{ syncRemaining }}</strong> 次同步</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores/form'

const formStore = useFormStore()
const mobileMenuOpen = ref(false)

const saveStatus = computed(() => formStore.saveStatus)
const syncRemaining = computed(() => Math.max(0, 3 - formStore.syncCount))

const saveStatusText = computed(() => {
  switch (saveStatus.value) {
    case 'saving': return '保存中...'
    case 'saved': return '已保存'
    case 'error': return '保存失败'
    default: return ''
  }
})
</script>
