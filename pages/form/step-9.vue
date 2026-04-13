<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="9" step-title="安全问题" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">安全问题</h2>
        <p class="text-sm text-gray-500 mb-6">Security Questions</p>
        <p class="text-gray-600 mb-8">请如实回答以下安全问题。所有答案都会被保密处理。</p>
        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <div class="space-y-4">
            <FormCheckbox v-model="formData.hasCommunicableDisease" label="您是否患有传染病？" secondary-label="Do you have a communicable disease?" hint="如肺结核、梅毒等" />
            <FormCheckbox v-model="formData.hasMentalDisorder" label="您是否患有精神疾病？" secondary-label="Do you have a mental disorder?" />
            <FormCheckbox v-model="formData.isDrugAbuser" label="您是否滥用药物或毒品？" secondary-label="Are you a drug abuser or addict?" />
            <FormCheckbox v-model="formData.hasArrestRecord" label="您是否曾被逮捕或定罪？" secondary-label="Have you ever been arrested or convicted?" field-path="securityQuestions1.hasArrestRecord" />
            <FormCheckbox v-model="formData.hasViolatedLaw" label="您是否曾违反管制物品法律？" secondary-label="Have you violated controlled substance laws?" />
            <FormCheckbox v-model="formData.hasEngagedInProstitution" label="您是否从事过卖淫？" secondary-label="Have you engaged in prostitution?" />
            <FormCheckbox v-model="formData.hasEngagedInTerrorism" label="您是否参与过恐怖活动？" secondary-label="Have you engaged in terrorism?" />
          </div>
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
  hasCommunicableDisease: store.formData.securityQuestions1.hasCommunicableDisease || false,
  hasMentalDisorder: store.formData.securityQuestions1.hasMentalDisorder || false,
  isDrugAbuser: store.formData.securityQuestions1.isDrugAbuser || false,
  hasArrestRecord: store.formData.securityQuestions1.hasArrestRecord || false,
  hasViolatedLaw: store.formData.securityQuestions1.hasViolatedControlledSubstanceLaw || false,
  hasEngagedInProstitution: store.formData.securityQuestions1.isEngagedInProstitution || false,
  hasEngagedInTerrorism: store.formData.securityQuestions1.isEngagedInTerrorism || false,
})
watch(formData, () => { store.updateStepData(9, formData) }, { deep: true })
function saveAndContinue() {
  store.updateStepData(9, formData)
  store.goToStep(10)
  router.push('/form/step-10')
}
onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(9)
})
</script>
