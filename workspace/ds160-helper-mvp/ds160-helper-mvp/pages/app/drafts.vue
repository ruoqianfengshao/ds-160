<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">草稿箱</h1>
      <p class="text-gray-600 mt-1">管理您的申请草稿</p>
    </div>
    
    <!-- Draft List -->
    <div v-if="hasDraft" class="space-y-4">
      <div class="card">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">
                DS-160 申请表草稿
              </h3>
              <p class="text-sm text-gray-500">
                创建于 {{ formatDate(draft?.createdAt) }} · 
                最后更新 {{ formatDate(draft?.updatedAt) }}
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
              进度 {{ draft?.currentStep || 1 }}/12
            </span>
            <span v-if="draft?.syncCount > 0" class="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              已同步 {{ draft?.syncCount }} 次
            </span>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-sm text-gray-500 mb-1">
            <span>填写进度</span>
            <span>{{ Math.round(((draft?.currentStep || 1) / 12) * 100) }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-primary-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${((draft?.currentStep || 1) / 12) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
          <NuxtLink 
            :to="`/app/form/step-${draft?.currentStep || 1}`"
            class="btn-primary"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            继续填写
          </NuxtLink>
          
          <button 
            class="btn-secondary"
            @click="handleDuplicate"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            复制草稿
          </button>
          
          <button 
            class="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
            @click="handleDelete"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            删除
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="card">
      <div class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          暂无草稿
        </h2>
        <p class="text-gray-600 mb-8">
          开始填写您的第一份 DS-160 申请表
        </p>
        <NuxtLink to="/app/dashboard" class="btn-primary text-lg px-8 py-4">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          新建申请
        </NuxtLink>
      </div>
    </div>
    
    <!-- Tips -->
    <div class="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <h3 class="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        关于草稿存储
      </h3>
      <ul class="text-gray-600 text-sm space-y-2">
        <li class="flex items-start gap-2">
          <span class="text-gray-400 mt-1">•</span>
          <span>草稿数据保存在您浏览器的本地存储中，清除浏览器数据会导致草稿丢失</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-gray-400 mt-1">•</span>
          <span>如需备份，建议在完成填写后将关键信息记录到安全的地方</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-gray-400 mt-1">•</span>
          <span>未来版本将支持云端同步和导出功能</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '~/stores/form'

definePageMeta({
  layout: 'app'
})

const router = useRouter()
const formStore = useFormStore()

const draft = computed(() => formStore.currentDraft)
const hasDraft = computed(() => formStore.isDraftSaved)

onMounted(() => {
  formStore.loadDraft()
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleDuplicate = () => {
  alert('复制功能将在后续版本中开放')
}

const handleDelete = () => {
  if (confirm('确定要删除这个草稿吗？此操作不可撤销。')) {
    formStore.clearDraft()
    router.push('/app/dashboard')
  }
}
</script>
