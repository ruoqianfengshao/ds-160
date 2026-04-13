<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="12" step-title="审核与提交" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">审核与提交</h2>
        <p class="text-sm text-gray-500 mb-6">Review & Submit</p>
        <p class="text-gray-600 mb-8">请仔细审核您填写的所有信息，确认无误后提交申请。</p>
        <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <h3 class="font-semibold text-green-900 mb-2">✓ 表单填写完成！/ Form Completed!</h3>
          <p class="text-sm text-green-800">所有必填项已完成，您可以审核并提交申请。/ All required fields are completed. You can review and submit your application.</p>
        </div>
        <form @submit.prevent="submitApplication" class="space-y-6">
          <div class="space-y-4">
            <FormCheckbox v-model="formData.certifyTruth" label="我证明以上所填信息真实准确" secondary-label="I certify that all information is true and accurate" required />
            <FormCheckbox v-model="formData.agreeToTerms" label="我同意条款和条件" secondary-label="I agree to the terms and conditions" required />
          </div>
          <div class="flex gap-4 justify-between mt-8">
            <button type="button" @click="router.push('/dashboard')" class="btn-secondary px-8 py-4">返回控制台 / Back to Dashboard</button>
            <button type="submit" class="btn-primary px-8 py-4" :disabled="!canSubmit">提交申请 / Submit Application</button>
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
  certifyTruth: false,
  agreeToTerms: false,
})
const canSubmit = computed(() => formData.certifyTruth && formData.agreeToTerms)
function submitApplication() {
  if (!canSubmit.value) return
  alert('申请提交成功！/ Application submitted successfully!')
  router.push('/dashboard')
}
onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(12)
})
</script>
