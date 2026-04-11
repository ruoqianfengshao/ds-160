<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="4" step-title="Travel Information" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Travel Information</h2>
        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <FormSelect v-model="formData.purposeOfTrip" label="Purpose of Trip to the U.S." 
            :options="['Business', 'Tourism', 'Study', 'Work', 'Medical Treatment', 'Other']" required />
          <FormInput v-if="formData.purposeOfTrip === 'Other'" v-model="formData.otherPurposeExplanation" 
            label="Please Explain" required />
          <FormSelect v-model="formData.whoIsPaying" label="Who is Paying for Your Trip?" 
            :options="['Self', 'Company/Organization', 'Other Person', 'Other']" required />
          <div class="text-center py-4 text-gray-500 text-sm">
            <svg class="w-4 h-4 inline mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Auto-saved
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
  purposeOfTrip: store.formData.travelInfo.purposeOfTrip,
  otherPurposeExplanation: store.formData.travelInfo.otherPurposeExplanation || '',
  whoIsPaying: store.formData.travelInfo.whoIsPaying,
  hasOtherPersonPaying: store.formData.travelInfo.hasOtherPersonPaying,
})
watch(formData, () => { store.updateStepData(4, formData) }, { deep: true })
function saveAndContinue() { store.goToStep(5); router.push('/form/step-5') }
onMounted(() => { store.initializeFromStorage(); store.goToStep(4) })
</script>
