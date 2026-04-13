<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="8" step-title="工作/教育信息" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">工作/教育信息</h2>
        <p class="text-sm text-gray-500 mb-6">Work/Education Information</p>
        <p class="text-gray-600 mb-8">请提供您的职业和教育背景信息。</p>
        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <FormSelect v-model="formData.primaryOccupation" label="当前职业" secondary-label="Primary Occupation" :options="occupationOptions" required hint="选择您当前的主要职业" />
          <div v-if="formData.primaryOccupation === 'Employed'" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">雇主信息</h3>
            <p class="text-sm text-gray-500 mb-4">Employer Information</p>
            <FormInput v-model="formData.employerName" label="雇主名称" secondary-label="Name of Employer" placeholder="ABC公司" required />
            <FormInput v-model="formData.jobTitle" label="职位" secondary-label="Job Title" placeholder="软件工程师" required />
          </div>
          <FormSelect v-model="formData.educationLevel" label="教育程度" secondary-label="Highest Level of Education" :options="educationOptions" required />
          <div class="text-sm text-gray-500 text-center py-4">
            <svg class="w-4 h-4 inline mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
            您的填写进度会自动保存
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDS160Store } from '~/stores/ds160'
definePageMeta({ layout: 'default' })
const store = useDS160Store()
const router = useRouter()
const formData = reactive({
  primaryOccupation: store.formData.workEducation.primaryOccupation || '',
  employerName: store.formData.workEducation.employerName || '',
  jobTitle: store.formData.workEducation.jobTitle || '',
  educationLevel: store.formData.workEducation.educationLevel || '',
})
watch(formData, () => { store.updateStepData(8, formData) }, { deep: true })
const occupationOptions = [
  { value: 'Student', label: '学生 (Student)' },
  { value: 'Employed', label: '在职 (Employed)' },
  { value: 'Self-Employed', label: '自雇 (Self-Employed)' },
  { value: 'Retired', label: '退休 (Retired)' },
  { value: 'Unemployed', label: '待业 (Unemployed)' },
]
const educationOptions = [
  { value: 'High School', label: '高中 (High School)' },
  { value: 'Bachelor', label: '本科 (Bachelor\'s Degree)' },
  { value: 'Master', label: '硕士 (Master\'s Degree)' },
  { value: 'Doctorate', label: '博士 (Doctorate)' },
]
function saveAndContinue() {
  store.updateStepData(8, formData)
  store.goToStep(9)
  router.push('/form/step-9')
}
onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(8)
})
</script>
