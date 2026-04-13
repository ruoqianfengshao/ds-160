<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="11" step-title="附加信息" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">附加信息</h2>
        <p class="text-sm text-gray-500 mb-6">Additional Information</p>
        <p class="text-gray-600 mb-8">请提供其他补充信息（如适用）。</p>
        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <FormInput v-model="formData.additionalInfo" label="补充说明（可选）" secondary-label="Additional Information (Optional)" placeholder="如有需要补充的信息，请在此填写" hint="例如：特殊情况说明、补充解释等" />
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
  additionalInfo: store.formData.additionalTravel.additionalInfo || '',
})
watch(formData, () => { store.updateStepData(11, formData) }, { deep: true })
function saveAndContinue() {
  store.updateStepData(11, formData)
  store.goToStep(12)
  router.push('/form/step-12')
}
onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(11)
})
</script>
