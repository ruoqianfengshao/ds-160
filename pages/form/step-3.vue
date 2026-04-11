<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="3" 
      step-title="Passport Information"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Passport Information</h2>
        <p class="text-gray-600 mb-8">
          Enter your passport details exactly as they appear on your passport.
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Passport Number -->
          <FormInput
            v-model="formData.passportNumber"
            label="Passport Number"
            placeholder="A12345678"
            required
            field-path="passportInfo.passportNumber"
            hint="Enter exactly as shown on your passport"
          />

          <!-- Passport Book Number (Optional) -->
          <FormInput
            v-model="formData.passportBookNumber"
            label="Passport Book Number (if applicable)"
            placeholder="C01234567"
            hint="Found on the inside cover of some passports"
          />

          <!-- Country of Issuance -->
          <FormSelect
            v-model="formData.countryOfIssuance"
            label="Country/Authority That Issued Passport"
            :options="countries"
            required
          />

          <!-- Issuance City -->
          <FormInput
            v-model="formData.issuanceCity"
            label="City Where Passport Was Issued"
            placeholder="London"
            required
          />

          <!-- Issuance State (Optional) -->
          <FormInput
            v-model="formData.issuanceState"
            label="State/Province Where Passport Was Issued (if applicable)"
            placeholder="England"
          />

          <!-- Issuance Country -->
          <FormSelect
            v-model="formData.issuanceCountry"
            label="Country Where Passport Was Issued"
            :options="countries"
            required
          />

          <!-- Issuance Date -->
          <FormInput
            v-model="formData.issuanceDate"
            type="date"
            label="Passport Issuance Date"
            required
            hint="MM/DD/YYYY format"
          />

          <!-- Expiration Date -->
          <FormInput
            v-model="formData.expirationDate"
            type="date"
            label="Passport Expiration Date"
            required
            hint="Must be valid for at least 6 months beyond your intended stay"
          />

          <!-- Lost/Stolen Passport Section -->
          <div class="border-t border-gray-200 pt-6 mt-6">
            <FormCheckbox
              v-model="formData.hasLostPassport"
              label="Have you ever lost a passport or had one stolen?"
              field-path="passportInfo.hasLostPassport"
            />

            <!-- Lost Passport Details (conditional) -->
            <div v-if="formData.hasLostPassport" class="mt-4 pl-8 space-y-4 border-l-4 border-warning-500">
              <div class="p-4 bg-warning-50 rounded-lg">
                <p class="text-sm font-semibold text-warning-800 mb-2">
                  ⚠️ Important: Lost/Stolen Passport
                </p>
                <p class="text-sm text-warning-700">
                  You must provide details about any lost or stolen passport. 
                  Failure to disclose this information may result in application denial.
                </p>
              </div>

              <FormInput
                v-model="formData.lostPassportDetails!.passportNumber"
                label="Lost/Stolen Passport Number"
                placeholder="B87654321"
                required
              />

              <FormSelect
                v-model="formData.lostPassportDetails!.countryOfIssuance"
                label="Country That Issued Lost/Stolen Passport"
                :options="countries"
                required
              />

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Explanation of Loss/Theft <span class="text-red-500">*</span>
                </label>
                <textarea
                  v-model="formData.lostPassportDetails!.explanation"
                  rows="4"
                  class="input-field"
                  placeholder="Describe the circumstances of how your passport was lost or stolen..."
                  required
                ></textarea>
                <p class="mt-1 text-sm text-gray-500">
                  Provide a detailed explanation of when, where, and how your passport was lost or stolen.
                </p>
              </div>
            </div>
          </div>

          <!-- Auto-save indicator -->
          <div class="text-sm text-gray-500 text-center py-4">
            <svg class="w-4 h-4 inline mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Your progress is automatically saved
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDS160Store } from '~/stores/ds160'

definePageMeta({
  layout: 'default'
})

const store = useDS160Store()
const router = useRouter()

const formData = reactive({
  passportNumber: store.formData.passportInfo.passportNumber,
  passportBookNumber: store.formData.passportInfo.passportBookNumber || '',
  countryOfIssuance: store.formData.passportInfo.countryOfIssuance,
  issuanceCity: store.formData.passportInfo.issuanceCity,
  issuanceState: store.formData.passportInfo.issuanceState || '',
  issuanceCountry: store.formData.passportInfo.issuanceCountry,
  issuanceDate: store.formData.passportInfo.issuanceDate,
  expirationDate: store.formData.passportInfo.expirationDate,
  hasLostPassport: store.formData.passportInfo.hasLostPassport,
  lostPassportDetails: store.formData.passportInfo.lostPassportDetails || {
    passportNumber: '',
    countryOfIssuance: '',
    explanation: '',
  },
})

watch(formData, () => {
  store.updateStepData(3, formData)
}, { deep: true })

const countries = [
  'United States', 'China', 'India', 'United Kingdom', 'Canada', 
  'Australia', 'Germany', 'France', 'Japan', 'South Korea',
  'Mexico', 'Brazil', 'Argentina', 'Spain', 'Italy',
].sort()

function saveAndContinue() {
  store.updateStepData(3, formData)
  store.goToStep(4)
  router.push('/form/step-4')
}

onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(3)
})
</script>
