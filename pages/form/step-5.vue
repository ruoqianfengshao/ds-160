<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="5" 
      step-title="联系地址"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">联系地址</h2>
        <p class="text-sm text-gray-500 mb-6">Contact Address & Phone Number</p>
        <p class="text-gray-600 mb-8">
          请提供您的家庭住址和联系方式。
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Home Address -->
          <div class="border-l-4 border-primary-500 pl-6">
            <h3 class="text-lg font-semibold mb-2">家庭住址</h3>
            <p class="text-sm text-gray-500 mb-4">Home Address</p>
            
            <FormInput
              v-model="formData.homeAddress.street"
              label="街道地址"
              secondary-label="Street Address"
              placeholder="朝阳区建国路88号"
              required
              hint="包括门牌号、楼号、单元号等"
            />

            <FormInput
              v-model="formData.homeAddress.city"
              label="城市"
              secondary-label="City"
              placeholder="北京"
              required
            />

            <FormInput
              v-model="formData.homeAddress.stateProvince"
              label="省份"
              secondary-label="State/Province"
              placeholder="北京市"
              required
            />

            <FormInput
              v-model="formData.homeAddress.postalCode"
              label="邮编"
              secondary-label="Postal Code"
              placeholder="100020"
              required
            />

            <FormSelect
              v-model="formData.homeAddress.country"
              label="国家"
              secondary-label="Country"
              :options="countries"
              required
            />
          </div>

          <!-- Mailing Address Same as Home -->
          <FormCheckbox
            v-model="formData.mailingAddressSameAsHome"
            label="通讯地址与家庭住址相同"
            secondary-label="Mailing Address is the same as Home Address"
          />

          <!-- Mailing Address (conditional) -->
          <div v-if="!formData.mailingAddressSameAsHome" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">通讯地址</h3>
            <p class="text-sm text-gray-500 mb-4">Mailing Address</p>

            <FormInput
              v-model="formData.mailingAddress.street"
              label="街道地址"
              secondary-label="Street Address"
              placeholder="海淀区中关村大街1号"
              required
            />

            <FormInput
              v-model="formData.mailingAddress.city"
              label="城市"
              secondary-label="City"
              placeholder="北京"
              required
            />

            <FormInput
              v-model="formData.mailingAddress.stateProvince"
              label="省份"
              secondary-label="State/Province"
              placeholder="北京市"
              required
            />

            <FormInput
              v-model="formData.mailingAddress.postalCode"
              label="邮编"
              secondary-label="Postal Code"
              placeholder="100080"
              required
            />

            <FormSelect
              v-model="formData.mailingAddress.country"
              label="国家"
              secondary-label="Country"
              :options="countries"
              required
            />
          </div>

          <!-- Phone Number -->
          <FormInput
            v-model="formData.primaryPhone"
            type="tel"
            label="主要电话号码"
            secondary-label="Primary Phone Number"
            placeholder="+86-10-12345678"
            required
            hint="包含国家代码（中国：+86）"
          />

          <!-- Secondary Phone -->
          <FormInput
            v-model="formData.secondaryPhone"
            type="tel"
            label="备用电话号码（可选）"
            secondary-label="Secondary Phone Number (Optional)"
            placeholder="+86-138-0000-0000"
            hint="手机号码、工作电话等"
          />

          <!-- Email -->
          <FormInput
            v-model="formData.email"
            type="email"
            label="电子邮箱"
            secondary-label="Email Address"
            placeholder="your.email@example.com"
            required
            hint="重要通知将发送至此邮箱"
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
  homeAddress: {
    street: store.formData.contactInfo.homeAddress?.street || '',
    city: store.formData.contactInfo.homeAddress?.city || '',
    stateProvince: store.formData.contactInfo.homeAddress?.stateProvince || '',
    postalCode: store.formData.contactInfo.homeAddress?.postalCode || '',
    country: store.formData.contactInfo.homeAddress?.country || 'China',
  },
  mailingAddressSameAsHome: store.formData.contactInfo.mailingAddressSameAsHome ?? true,
  mailingAddress: {
    street: store.formData.contactInfo.mailingAddress?.street || '',
    city: store.formData.contactInfo.mailingAddress?.city || '',
    stateProvince: store.formData.contactInfo.mailingAddress?.stateProvince || '',
    postalCode: store.formData.contactInfo.mailingAddress?.postalCode || '',
    country: store.formData.contactInfo.mailingAddress?.country || 'China',
  },
  primaryPhone: store.formData.contactInfo.phoneNumber || '',
  secondaryPhone: store.formData.contactInfo.secondaryPhoneNumber || '',
  email: store.formData.contactInfo.email || '',
})

watch(formData, () => {
  store.updateStepData(5, formData)
}, { deep: true })

const countries = [
  'China', 'United States', 'India', 'United Kingdom', 'Canada', 
  'Australia', 'Germany', 'France', 'Japan', 'South Korea',
  'Mexico', 'Brazil', 'Argentina', 'Spain', 'Italy',
].sort()

function saveAndContinue() {
  store.updateStepData(5, formData)
  store.goToStep(6)
  router.push('/form/step-6')
}

onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(5)
})
</script>
