<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="2" 
      step-title="旅行信息"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">旅行信息</h2>
        <p class="text-sm text-gray-500 mb-6">Travel Information</p>
        <p class="text-gray-600 mb-8">
          请提供您此次赴美旅行的相关信息。
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Purpose of Trip -->
          <FormSelect
            v-model="formData.purposeOfTrip"
            label="旅行目的"
            secondary-label="Purpose of Trip to the U.S."
            :options="purposeOptions"
            required
            hint="选择您此次赴美的主要目的"
          />

          <!-- Other Purpose (conditional) -->
          <FormInput
            v-if="formData.purposeOfTrip === 'Other'"
            v-model="formData.otherPurpose"
            label="其他目的说明"
            secondary-label="Explain Other Purpose"
            placeholder="请详细说明"
            required
          />

          <!-- Specific Travel Plans -->
          <FormInput
            v-model="formData.intendedArrivalDate"
            type="date"
            label="计划到达日期"
            secondary-label="Intended Date of Arrival"
            required
            hint="预计抵达美国的日期"
          />

          <FormInput
            v-model="formData.intendedLengthOfStay"
            type="number"
            label="计划停留时长（天）"
            secondary-label="Intended Length of Stay (Days)"
            placeholder="14"
            required
            hint="计划在美国停留的天数"
          />

          <!-- Address in the U.S. -->
          <div class="border-l-4 border-primary-500 pl-6 mt-8">
            <h3 class="text-lg font-semibold mb-2">在美地址</h3>
            <p class="text-sm text-gray-500 mb-4">Address Where You Will Stay in the U.S.</p>
            
            <FormInput
              v-model="formData.usAddress.street"
              label="街道地址"
              secondary-label="Street Address"
              placeholder="123 Main Street"
              required
              field-path="travelInfo.addressInUS"
              hint="如果是酒店，请填写酒店地址"
            />

            <FormInput
              v-model="formData.usAddress.city"
              label="城市"
              secondary-label="City"
              placeholder="New York"
              required
            />

            <FormSelect
              v-model="formData.usAddress.state"
              label="州"
              secondary-label="State"
              :options="usStates"
              required
            />

            <FormInput
              v-model="formData.usAddress.zipCode"
              label="邮编"
              secondary-label="Zip Code"
              placeholder="10001"
              required
              hint="5位数邮编"
            />
          </div>

          <!-- Who is paying for your trip -->
          <FormSelect
            v-model="formData.whoIsPaying"
            label="谁为此次旅行付费？"
            secondary-label="Who is paying for your trip?"
            :options="payingOptions"
            required
            hint="选择为您此次旅行支付费用的主要来源"
          />

          <!-- Payer Information (conditional) -->
          <div v-if="formData.whoIsPaying === 'Other Person' || formData.whoIsPaying === 'Other Company or Organization'" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">支付者信息</h3>
            <p class="text-sm text-gray-500 mb-4">Payer Information</p>

            <FormInput
              v-if="formData.whoIsPaying === 'Other Person'"
              v-model="formData.payerInfo.surname"
              label="姓"
              secondary-label="Surname"
              placeholder="WANG"
              required
            />

            <FormInput
              v-if="formData.whoIsPaying === 'Other Person'"
              v-model="formData.payerInfo.givenName"
              label="名"
              secondary-label="Given Name"
              placeholder="MING"
              required
            />

            <FormInput
              v-if="formData.whoIsPaying === 'Other Company or Organization'"
              v-model="formData.payerInfo.organizationName"
              label="机构/公司名称"
              secondary-label="Name of Company or Organization"
              placeholder="ABC Corporation"
              required
            />

            <FormInput
              v-model="formData.payerInfo.phone"
              type="tel"
              label="电话号码"
              secondary-label="Telephone Number"
              placeholder="+1-555-0123"
              required
              hint="包含国家代码"
            />

            <FormInput
              v-if="formData.whoIsPaying === 'Other Person'"
              v-model="formData.payerInfo.relationship"
              label="与您的关系"
              secondary-label="Relationship to You"
              placeholder="父亲/朋友/雇主等"
              required
            />

            <FormInput
              v-model="formData.payerInfo.email"
              type="email"
              label="电子邮件"
              secondary-label="Email Address"
              placeholder="payer@example.com"
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
  purposeOfTrip: store.formData.travelInfo.purposeOfTrip || '',
  otherPurpose: store.formData.travelInfo.otherPurpose || '',
  intendedArrivalDate: store.formData.travelInfo.intendedArrivalDate || '',
  intendedLengthOfStay: store.formData.travelInfo.intendedLengthOfStay || '',
  usAddress: {
    street: store.formData.travelInfo.usAddress?.street || '',
    city: store.formData.travelInfo.usAddress?.city || '',
    state: store.formData.travelInfo.usAddress?.state || '',
    zipCode: store.formData.travelInfo.usAddress?.zipCode || '',
  },
  whoIsPaying: store.formData.travelInfo.whoIsPaying || '',
  payerInfo: {
    surname: store.formData.travelInfo.payerInfo?.surname || '',
    givenName: store.formData.travelInfo.payerInfo?.givenName || '',
    organizationName: store.formData.travelInfo.payerInfo?.organizationName || '',
    phone: store.formData.travelInfo.payerInfo?.phone || '',
    relationship: store.formData.travelInfo.payerInfo?.relationship || '',
    email: store.formData.travelInfo.payerInfo?.email || '',
  },
})

watch(formData, () => {
  store.updateStepData(2, formData)
}, { deep: true })

const purposeOptions = [
  { value: 'Tourism', label: '旅游 (Tourism)' },
  { value: 'Business', label: '商务 (Business)' },
  { value: 'Study', label: '学习 (Study/Student)' },
  { value: 'Work', label: '工作 (Work/Employment)' },
  { value: 'Medical Treatment', label: '就医 (Medical Treatment)' },
  { value: 'Conference', label: '会议 (Conference/Convention)' },
  { value: 'Transit', label: '过境 (Transit)' },
  { value: 'Other', label: '其他 (Other)' },
]

const payingOptions = [
  { value: 'Self', label: '本人 (Self)' },
  { value: 'Other Person', label: '其他个人 (Other Person)' },
  { value: 'Other Company or Organization', label: '公司/机构 (Company or Organization)' },
]

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
  'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'District of Columbia'
].sort()

function saveAndContinue() {
  store.updateStepData(2, formData)
  store.goToStep(3)
  router.push('/form/step-3')
}

onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(2)
})
</script>
