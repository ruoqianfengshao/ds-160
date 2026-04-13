<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="4" 
      step-title="前次美国旅行"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">前次美国旅行</h2>
        <p class="text-sm text-gray-500 mb-6">Previous U.S. Travel</p>
        <p class="text-gray-600 mb-8">
          请提供您之前访问美国的相关信息。
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Have you ever been to the US -->
          <FormCheckbox
            v-model="formData.hasBeenToUS"
            label="您是否曾经去过美国？"
            secondary-label="Have you ever been to the United States?"
            hint="包括任何类型的访问：旅游、商务、学习、过境等"
          />

          <!-- Previous Visits (conditional) -->
          <div v-if="formData.hasBeenToUS" class="pl-8 space-y-6 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">前次访美记录</h3>
            <p class="text-sm text-gray-500 mb-4">Details of Previous Visits</p>

            <FormInput
              v-model="formData.lastArrivalDate"
              type="date"
              label="最近一次到达日期"
              secondary-label="Date of Last Arrival"
              required
              hint="您最近一次抵达美国的日期"
            />

            <FormInput
              v-model="formData.lastStayLength"
              type="number"
              label="最近一次停留时长（天）"
              secondary-label="Length of Last Stay (Days)"
              placeholder="14"
              required
            />

            <FormInput
              v-model="formData.previousVisitsCount"
              type="number"
              label="访美总次数"
              secondary-label="Total Number of Visits"
              placeholder="3"
              hint="包括最近这一次在内的所有访美次数"
            />
          </div>

          <!-- Have you been issued a US visa before -->
          <FormCheckbox
            v-model="formData.hasBeenIssuedUSVisa"
            label="您是否曾获得过美国签证？"
            secondary-label="Have you ever been issued a U.S. Visa?"
            hint="包括任何类型的签证"
          />

          <!-- Previous Visa Information (conditional) -->
          <div v-if="formData.hasBeenIssuedUSVisa" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">上次签证信息</h3>
            <p class="text-sm text-gray-500 mb-4">Last U.S. Visa Information</p>

            <FormInput
              v-model="formData.lastVisaNumber"
              label="签证号码"
              secondary-label="Visa Number"
              placeholder="12345678"
              hint="位于签证右下角的红色数字"
            />

            <FormInput
              v-model="formData.lastVisaIssueDate"
              type="date"
              label="签发日期"
              secondary-label="Issue Date"
              required
            />

            <FormCheckbox
              v-model="formData.isVisaSameType"
              label="与本次申请类型相同"
              secondary-label="Same visa type as this application"
            />

            <FormCheckbox
              v-model="formData.isSameCountry"
              label="在同一国家签发"
              secondary-label="Issued in the same country"
            />
          </div>

          <!-- Have you ever been refused a US visa -->
          <FormCheckbox
            v-model="formData.hasBeenRefusedUSVisa"
            label="您是否曾被拒签过美国签证？"
            secondary-label="Have you ever been refused a U.S. Visa?"
            field-path="previousUSTravel.hasBeenRefused"
            hint="请如实填写，拒签记录不影响本次申请"
          />

          <!-- Refusal Details (conditional) -->
          <div v-if="formData.hasBeenRefusedUSVisa" class="pl-8 space-y-4 border-l-4 border-warning-200 bg-warning-50 p-4 rounded">
            <p class="text-sm text-warning-800 mb-2">
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              请如实说明拒签情况，隐瞒信息可能导致永久拒签
            </p>

            <FormInput
              v-model="formData.refusalExplanation"
              label="拒签说明"
              secondary-label="Explanation of Visa Refusal"
              placeholder="请说明拒签时间、地点和原因"
              required
              hint="例如：2023年北京使馆，因材料不全被拒"
            />
          </div>

          <!-- Have you ever been refused entry at the US port of entry -->
          <FormCheckbox
            v-model="formData.hasBeenRefusedUSEntry"
            label="您是否曾在美国入境口岸被拒绝入境？"
            secondary-label="Have you ever been refused admission at a U.S. port of entry?"
            hint="即使持有有效签证，但在入境时被拒"
          />

          <!-- Have you ever had a visa cancelled -->
          <FormCheckbox
            v-model="formData.hasHadVisaCancelled"
            label="您的签证是否曾被取消或撤销？"
            secondary-label="Have you ever had a U.S. Visa cancelled or revoked?"
          />

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
  hasBeenToUS: store.formData.previousUSTravel.hasBeenToUS || false,
  lastArrivalDate: store.formData.previousUSTravel.lastArrivalDate || '',
  lastStayLength: store.formData.previousUSTravel.lastStayLength || '',
  previousVisitsCount: store.formData.previousUSTravel.previousVisitsCount || '',
  hasBeenIssuedUSVisa: store.formData.previousUSTravel.hasBeenIssuedUSVisa || false,
  lastVisaNumber: store.formData.previousUSTravel.lastVisaNumber || '',
  lastVisaIssueDate: store.formData.previousUSTravel.lastVisaIssueDate || '',
  isVisaSameType: store.formData.previousUSTravel.isVisaSameType || false,
  isSameCountry: store.formData.previousUSTravel.isSameCountry || false,
  hasBeenRefusedUSVisa: store.formData.previousUSTravel.hasBeenRefusedUSVisa || false,
  refusalExplanation: store.formData.previousUSTravel.refusalExplanation || '',
  hasBeenRefusedUSEntry: store.formData.previousUSTravel.hasBeenRefusedUSEntry || false,
  hasHadVisaCancelled: store.formData.previousUSTravel.hasHadVisaCancelled || false,
})

watch(formData, () => {
  store.updateStepData(4, formData)
}, { deep: true })

function saveAndContinue() {
  store.updateStepData(4, formData)
  store.goToStep(5)
  router.push('/form/step-5')
}

onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(4)
})
</script>
