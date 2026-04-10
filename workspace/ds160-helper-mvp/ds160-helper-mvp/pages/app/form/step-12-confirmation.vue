<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="card">
      <!-- Success Header -->
      <div class="text-center py-8 border-b border-gray-100">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          恭喜！您的 DS-160 表格填写完成
        </h1>
        <p class="text-gray-600">
          您已完成全部12个步骤的表单填写
        </p>
      </div>
      
      <!-- Summary -->
      <div class="py-6 border-b border-gray-100">
        <h2 class="font-semibold text-gray-900 mb-4">填写摘要</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">申请人姓名</p>
              <p class="font-medium text-gray-900">{{ formData.personalInfo?.fullName || '-' }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">护照号码</p>
              <p class="font-medium text-gray-900">{{ formData.passportInfo?.passportNumber || '-' }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">旅行目的</p>
              <p class="font-medium text-gray-900">{{ getTravelPurpose(formData.travelInfo?.purposeOfTrip) }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">预计到达</p>
              <p class="font-medium text-gray-900">{{ formatDate(formData.travelInfo?.expectedArrivalDate) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sync Section -->
      <div class="py-6">
        <h2 class="font-semibold text-gray-900 mb-4">同步到 DS-160 官网</h2>
        
        <div v-if="syncCount < 3" class="bg-gray-50 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-1">模拟同步</h3>
              <p class="text-sm text-gray-600 mb-4">
                点击下方按钮体验"同步到DS-160官网"的完整流程。<br>
                当前版本为 MVP，仅展示交互效果，不实际连接官网。
              </p>
              <div class="flex items-center gap-2 mb-4">
                <span class="text-sm text-gray-500">剩余同步次数：</span>
                <span class="px-2 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {{ 3 - syncCount }} / 3
                </span>
              </div>
              <button 
                class="btn-primary"
                :disabled="syncInProgress"
                @click="handleSync"
              >
                <svg v-if="!syncInProgress" class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <svg v-else class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ syncInProgress ? '同步中...' : '同步到 DS-160 官网' }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-else class="bg-warning-50 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-warning-800 mb-1">免费同步次数已用完</h3>
              <p class="text-sm text-warning-700 mb-4">
                您已用完3次免费模拟同步体验。如需更多功能，可以升级到个人版或家庭版。
              </p>
              <NuxtLink to="/pricing" class="btn-warning">
                查看定价方案
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Success Message -->
      <div v-if="syncSuccess" class="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium text-green-800">同步成功！</p>
            <p class="text-sm text-green-700">您的申请数据已准备好，您可以在DS-160官网继续操作。</p>
          </div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 mt-6">
        <button class="btn-secondary" @click="handleReview">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回修改
        </button>
        <NuxtLink to="/app/dashboard" class="btn-primary">
          返回首页
        </NuxtLink>
      </div>
    </div>
    
    <!-- Tips -->
    <div class="mt-6 p-6 bg-primary-50 rounded-xl border border-primary-100">
      <h3 class="font-semibold text-primary-900 mb-3 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        下一步建议
      </h3>
      <ul class="text-primary-800 text-sm space-y-2">
        <li class="flex items-start gap-2">
          <span class="text-primary-600 mt-1">•</span>
          <span>建议在正式提交DS-160前，准备好护照、身份证、行程单等相关材料</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-600 mt-1">•</span>
          <span>照片需要符合美国签证要求，建议使用专业照相馆拍摄</span>
        </li>
        <li class="flex items-start gap-2">
          <span class="text-primary-600 mt-1">•</span>
          <span>填写完成后需要支付签证费用并预约面签时间</span>
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

const syncInProgress = ref(false)
const syncSuccess = ref(false)

const formData = computed(() => formStore.formData)
const syncCount = computed(() => formStore.syncCount)

const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getTravelPurpose = (purpose?: string) => {
  const purposes: Record<string, string> = {
    tourism: '旅游 (B2)',
    business: '商务 (B1)',
    student: '学生 (F1)',
    transit: '过境'
  }
  return purposes[purpose || ''] || '-'
}

const handleSync = async () => {
  syncInProgress.value = true
  await formStore.simulateSync()
  syncInProgress.value = false
  syncSuccess.value = formStore.syncSuccess
}

const handleReview = () => {
  router.push(`/app/form/step-1`)
}
</script>
