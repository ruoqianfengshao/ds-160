<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">我的申请</h1>
      <p class="text-gray-600 mt-1">管理您的 DS-160 签证申请表</p>
    </div>
    
    <!-- Draft Info Card -->
    <div v-if="hasDraft" class="card mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center">
            <svg class="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">未完成的申请</h2>
            <p class="text-sm text-gray-500">
              上次编辑于 {{ formatDate(formStore.currentDraft?.updatedAt) }} · 
              进度：{{ formStore.currentStep }}/12 ({{ formStore.progress }}%)
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink 
            :to="`/app/form/step-${formStore.currentStep}`"
            class="btn-primary"
          >
            继续填写
          </NuxtLink>
          <button 
            class="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
            @click="handleDeleteDraft"
          >
            删除
          </button>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="mt-6">
        <div class="flex justify-between text-sm text-gray-500 mb-2">
          <span>填写进度</span>
          <span>{{ formStore.progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${formStore.progress}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Empty State / New Application -->
    <div class="card">
      <div class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-gray-900 mb-2">
          {{ hasDraft ? '创建新的申请' : '开始您的签证申请' }}
        </h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          {{ hasDraft 
            ? '您可以创建新的申请，原有草稿将保留在草稿箱中' 
            : '填写 DS-160 表格，轻松完成美国签证申请' 
          }}
        </p>
        <button 
          class="btn-primary text-lg px-8 py-4"
          @click="handleCreateNew"
        >
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ hasDraft ? '新建申请' : '开始填写' }}
        </button>
      </div>
    </div>
    
    <!-- Features Overview -->
    <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">12步引导</h3>
            <p class="text-sm text-gray-600">将复杂表格拆分为简单步骤</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">自动保存</h3>
            <p class="text-sm text-gray-600">实时保存，无需担心数据丢失</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900 mb-1">风险提示</h3>
            <p class="text-sm text-gray-600">高风险字段智能标注提醒</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Tips -->
    <div class="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-100">
      <h3 class="font-semibold text-primary-900 mb-3 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        温馨提示
      </h3>
      <ul class="text-primary-800 text-sm space-y-2">
        <li class="flex items-start gap-2">
          <span class="text-primary-600 mt-1">•</span>
          <span>所有数据仅保存在您的浏览器本地，不会上传至服务器</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-600 mt-1">•</span>
          <span>高风险字段（如犯罪记录、拒签历史）请如实填写，这关系到您的签证结果</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-600 mt-1">•</span>
          <span>免费版提供3次模拟同步体验，可提前熟悉操作流程</span>
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

const formStore = useFormStore()
const router = useRouter()

const hasDraft = computed(() => formStore.isDraftSaved)

onMounted(() => {
  formStore.loadDraft()
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN')
}

const handleCreateNew = () => {
  formStore.createNewDraft()
  router.push('/app/form/step-1')
}

const handleDeleteDraft = () => {
  if (confirm('确定要删除这个草稿吗？此操作不可撤销。')) {
    formStore.clearDraft()
  }
}
</script>
