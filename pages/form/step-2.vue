<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="2" 
      step-title="Contact Information"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Contact Information</h2>
        <p class="text-gray-600 mb-8">
          Provide your current home address and contact details.
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Home Address Section -->
          <div class="border-l-4 border-primary-500 pl-6">
            <h3 class="text-xl font-semibold mb-4">Home Address</h3>
            
            <FormInput
              v-model="formData.homeAddress.street"
              label="Street Address"
              placeholder="123 Main Street, Apt 4B"
              required
              field-path="contactInfo.addressInUS"
              hint="Include apartment, suite, or unit number"
            />

            <FormInput
              v-model="formData.homeAddress.city"
              label="City"
              placeholder="New York"
              required
            />

            <FormInput
              v-model="formData.homeAddress.state"
              label="State/Province"
              placeholder="New York"
              required
            />

            <FormInput
              v-model="formData.homeAddress.zipCode"
              label="Postal/Zip Code"
              placeholder="10001"
              required
            />

            <FormSelect
              v-model="formData.homeAddress.country"
              label="Country"
              :options="countries"
              required
            />
          </div>

          <!-- Phone Number -->
          <FormInput
            v-model="formData.phoneNumber"
            type="tel"
            label="Primary Phone Number"
            placeholder="+1-555-0123"
            required
            hint="Include country code (e.g., +1 for US)"
          />

          <!-- Secondary Phone -->
          <FormInput
            v-model="formData.secondaryPhoneNumber"
            type="tel"
            label="Secondary Phone Number (Optional)"
            placeholder="+1-555-0456"
            hint="Work phone, mobile, etc."
          />

          <!-- Email -->
          <FormInput
            v-model="formData.email"
            type="email"
            label="Email Address"
            placeholder="john.smith@example.com"
            required
            hint="You will receive important notifications at this address"
          />

          <!-- Social Media (Optional) -->
          <div class="border-t border-gray-200 pt-6 mt-6">
            <h3 class="text-lg font-semibold mb-4">Social Media (Optional)</h3>
            <p class="text-sm text-gray-600 mb-4">
              List all social media accounts you have used in the past 5 years.
            </p>

            <div 
              v-for="(social, index) in formData.socialMedia" 
              :key="index"
              class="p-4 bg-gray-50 rounded-lg mb-4"
            >
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">Social Media Account {{ index + 1 }}</h4>
                <button
                  v-if="formData.socialMedia && formData.socialMedia.length > 1"
                  type="button"
                  @click="removeSocialMedia(index)"
                  class="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>

              <FormSelect
                v-model="social.platform"
                label="Platform"
                :options="socialPlatforms"
                class="mb-3"
              />

              <FormInput
                v-model="social.handle"
                label="Username/Handle"
                placeholder="@johnsmith"
                no-margin
              />
            </div>

            <button
              type="button"
              @click="addSocialMedia"
              class="btn-secondary w-full"
            >
              + Add Social Media Account
            </button>
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
  homeAddress: {
    street: store.formData.contactInfo.homeAddress.street,
    city: store.formData.contactInfo.homeAddress.city,
    state: store.formData.contactInfo.homeAddress.state,
    zipCode: store.formData.contactInfo.homeAddress.zipCode,
    country: store.formData.contactInfo.homeAddress.country,
  },
  phoneNumber: store.formData.contactInfo.phoneNumber,
  secondaryPhoneNumber: store.formData.contactInfo.secondaryPhoneNumber || '',
  email: store.formData.contactInfo.email,
  socialMedia: store.formData.contactInfo.socialMedia || [{ platform: '', handle: '' }],
})

watch(formData, () => {
  store.updateStepData(2, formData)
}, { deep: true })

const countries = [
  'United States', 'China', 'India', 'United Kingdom', 'Canada', 
  'Australia', 'Germany', 'France', 'Japan', 'South Korea',
  'Mexico', 'Brazil', 'Argentina', 'Spain', 'Italy',
].sort()

const socialPlatforms = [
  'Facebook', 'Twitter/X', 'Instagram', 'LinkedIn', 
  'TikTok', 'YouTube', 'WeChat', 'QQ', 'Weibo'
].sort()

function addSocialMedia() {
  if (!formData.socialMedia) formData.socialMedia = []
  formData.socialMedia.push({ platform: '', handle: '' })
}

function removeSocialMedia(index: number) {
  formData.socialMedia?.splice(index, 1)
}

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
