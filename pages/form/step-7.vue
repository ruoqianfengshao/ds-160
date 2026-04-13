<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="7" step-title="家庭信息" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">家庭信息</h2>
        <p class="text-sm text-gray-500 mb-6">Family Information</p>
        <p class="text-gray-600 mb-8">请提供您的父母和配偶（如适用）的信息。</p>
        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <div class="border-l-4 border-primary-500 pl-6">
            <h3 class="text-lg font-semibold mb-2">父亲信息</h3>
            <p class="text-sm text-gray-500 mb-4">Father's Information</p>
            <FormInput v-model="formData.fatherSurname" label="姓" secondary-label="Surname" placeholder="WANG" required />
            <FormInput v-model="formData.fatherGivenName" label="名" secondary-label="Given Name" placeholder="MING" required />
            <FormInput v-model="formData.fatherBirthDate" type="date" label="出生日期" secondary-label="Date of Birth" />
          </div>
          <div class="border-l-4 border-primary-500 pl-6 mt-6">
            <h3 class="text-lg font-semibold mb-2">母亲信息</h3>
            <p class="text-sm text-gray-500 mb-4">Mother's Information</p>
            <FormInput v-model="formData.motherSurname" label="姓" secondary-label="Surname" placeholder="LI" required />
            <FormInput v-model="formData.motherGivenName" label="名" secondary-label="Given Name" placeholder="HUA" required />
            <FormInput v-model="formData.motherBirthDate" type="date" label="出生日期" secondary-label="Date of Birth" />
          </div>
          <FormCheckbox v-model="formData.hasImmediateRelativesInUS" label="您是否有直系亲属在美国？" secondary-label="Do you have immediate relatives in the U.S.?" hint="包括父母、兄弟姐妹、配偶或子女" />
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
  fatherSurname: store.formData.familyInfo.fatherInfo?.surname || '',
  fatherGivenName: store.formData.familyInfo.fatherInfo?.givenName || '',
  fatherBirthDate: store.formData.familyInfo.fatherInfo?.dateOfBirth || '',
  motherSurname: store.formData.familyInfo.motherInfo?.surname || '',
  motherGivenName: store.formData.familyInfo.motherInfo?.givenName || '',
  motherBirthDate: store.formData.familyInfo.motherInfo?.dateOfBirth || '',
  hasImmediateRelativesInUS: store.formData.familyInfo.hasImmediateRelativesInUS || false,
})
watch(formData, () => { store.updateStepData(7, formData) }, { deep: true })
function saveAndContinue() {
  store.updateStepData(7, formData)
  store.goToStep(8)
  router.push('/form/step-8')
}
onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(7)
})
</script>
