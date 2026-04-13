<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="6" 
      step-title="护照信息"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">护照信息</h2>
        <p class="text-sm text-gray-500 mb-6">Passport Information</p>
        <p class="text-gray-600 mb-8">
          请填写您的护照信息，必须与护照上的信息完全一致。
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Passport Number -->
          <FormInput
            v-model="formData.passportNumber"
            label="护照号码"
            secondary-label="Passport Number"
            placeholder="E12345678"
            required
            field-path="passportInfo.passportNumber"
            hint="填写护照第一页上的护照号码"
          />

          <!-- Country of Issuance -->
          <FormSelect
            v-model="formData.countryOfIssuance"
            label="签发国家"
            secondary-label="Country/Authority That Issued Passport"
            :options="countries"
            required
          />

          <!-- Issuance City -->
          <FormInput
            v-model="formData.issuanceCity"
            label="签发城市"
            secondary-label="City Where Passport Was Issued"
            placeholder="北京"
            required
          />

          <!-- Issuance Date -->
          <FormInput
            v-model="formData.issuanceDate"
            type="date"
            label="签发日期"
            secondary-label="Issuance Date"
            required
            hint="护照签发日期"
          />

          <!-- Expiration Date -->
          <FormInput
            v-model="formData.expirationDate"
            type="date"
            label="到期日期"
            secondary-label="Expiration Date"
            required
            field-path="passportInfo.expirationDate"
            hint="护照到期日期（必须在旅行日期后至少6个月有效）"
          />

          <!-- Lost or Stolen Passport -->
          <FormCheckbox
            v-model="formData.hasLostPassport"
            label="您是否曾丢失或被盗过护照？"
            secondary-label="Have you ever lost a passport or had one stolen?"
            hint="如实填写，不影响签证申请"
          />

          <!-- Lost Passport Details (conditional) -->
          <div v-if="formData.hasLostPassport" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">遗失护照信息</h3>
            <p class="text-sm text-gray-500 mb-4">Lost/Stolen Passport Details</p>

            <FormInput
              v-model="formData.lostPassportNumber"
              label="遗失护照号码"
              secondary-label="Lost Passport Number"
              placeholder="E00000000"
              required
            />

            <FormSelect
              v-model="formData.lostPassportCountry"
              label="遗失护照签发国"
              secondary-label="Country of Lost Passport"
              :options="countries"
              required
            />

            <FormInput
              v-model="formData.lostPassportExplanation"
              label="说明"
              secondary-label="Explanation"
              placeholder="请说明丢失/被盗的时间、地点和情况"
              required
            />
          </div>

          <!-- Auto-save indicator -->
          <div class="text-sm text-gray-500 text-center py-4">
            <svg class="w-4 h-4 inline mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            您的填写进度会自动保存
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
  passportNumber: store.formData.passportInfo.passportNumber || '',
  countryOfIssuance: store.formData.passportInfo.countryOfIssuance || 'China',
  issuanceCity: store.formData.passportInfo.issuanceCity || '',
  issuanceDate: store.formData.passportInfo.issuanceDate || '',
  expirationDate: store.formData.passportInfo.expirationDate || '',
  hasLostPassport: store.formData.passportInfo.hasLostPassport || false,
  lostPassportNumber: store.formData.passportInfo.lostPassportNumber || '',
  lostPassportCountry: store.formData.passportInfo.lostPassportCountry || '',
  lostPassportExplanation: store.formData.passportInfo.lostPassportExplanation || '',
})

watch(formData, () => {
  store.updateStepData(6, formData)
}, { deep: true })

const countries = ['China', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'South Korea'].sort()

function saveAndContinue() {
  store.updateStepData(6, formData)
  store.goToStep(7)
  router.push('/form/step-7')
}

onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(6)
})
</script>
