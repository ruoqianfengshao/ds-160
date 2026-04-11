<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="1" 
      step-title="Personal Information"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Personal Information</h2>
        <p class="text-gray-600 mb-8">
          Please enter your personal details exactly as they appear on your passport.
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Surname -->
          <FormInput
            v-model="formData.surname"
            label="Surname (Family Name)"
            placeholder="SMITH"
            required
            field-path="personalInfo.surname"
            hint="Enter surname exactly as shown in passport"
          />

          <!-- Given Name -->
          <FormInput
            v-model="formData.givenName"
            label="Given Name (First Name)"
            placeholder="JOHN"
            required
            hint="Enter given name exactly as shown in passport"
          />

          <!-- Full Name in Native Alphabet -->
          <FormInput
            v-model="formData.fullNameInNativeAlphabet"
            label="Full Name in Native Alphabet (if applicable)"
            placeholder="约翰·史密斯"
            hint="If your native language uses non-Latin characters"
          />

          <!-- Has Other Names -->
          <FormCheckbox
            v-model="formData.hasOtherNames"
            label="Have you ever used other names?"
            field-path="personalInfo.hasOtherNames"
            hint="Including maiden name, aliases, or name changes"
          />

          <!-- Other Names (conditional) -->
          <div v-if="formData.hasOtherNames" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <div 
              v-for="(name, index) in formData.otherNames" 
              :key="index"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">Other Name {{ index + 1 }}</h4>
                <button
                  v-if="formData.otherNames && formData.otherNames.length > 1"
                  type="button"
                  @click="removeOtherName(index)"
                  class="text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <FormInput
                v-model="name.surname"
                label="Surname"
                placeholder="Previous surname"
                no-margin
                class="mb-3"
              />
              
              <FormInput
                v-model="name.givenName"
                label="Given Name"
                placeholder="Previous given name"
                no-margin
              />
            </div>

            <button
              type="button"
              @click="addOtherName"
              class="btn-secondary w-full"
            >
              + Add Another Name
            </button>
          </div>

          <!-- Date of Birth -->
          <FormInput
            v-model="formData.dateOfBirth"
            type="date"
            label="Date of Birth"
            required
            hint="MM/DD/YYYY format"
          />

          <!-- City of Birth -->
          <FormInput
            v-model="formData.cityOfBirth"
            label="City of Birth"
            placeholder="New York"
            required
          />

          <!-- State of Birth (optional) -->
          <FormInput
            v-model="formData.stateOfBirth"
            label="State/Province of Birth (if applicable)"
            placeholder="New York"
          />

          <!-- Country of Birth -->
          <FormSelect
            v-model="formData.countryOfBirth"
            label="Country of Birth"
            :options="countries"
            required
            hint="Select your country of birth"
          />

          <!-- Nationality -->
          <FormSelect
            v-model="formData.nationality"
            label="Nationality"
            :options="countries"
            required
            hint="Select your current nationality"
          />

          <!-- Has Other Nationality -->
          <FormCheckbox
            v-model="formData.hasOtherNationality"
            label="Do you hold any other nationalities?"
          />

          <!-- Other Nationalities (conditional) -->
          <div v-if="formData.hasOtherNationality" class="pl-8">
            <FormSelect
              v-for="(nat, index) in formData.otherNationalities"
              :key="index"
              v-model="formData.otherNationalities[index]"
              :label="`Other Nationality ${index + 1}`"
              :options="countries"
            />
            <button
              type="button"
              @click="addOtherNationality"
              class="btn-secondary mt-2"
            >
              + Add Another Nationality
            </button>
          </div>

          <!-- National ID Number -->
          <FormInput
            v-model="formData.nationalIdNumber"
            label="National Identification Number (if applicable)"
            placeholder="123456789"
            hint="Your national ID or identity card number"
          />

          <!-- US Social Security Number -->
          <FormInput
            v-model="formData.usSocialSecurityNumber"
            label="U.S. Social Security Number (if applicable)"
            placeholder="123-45-6789"
            hint="Only if you have been issued a U.S. SSN"
          />

          <!-- US Taxpayer ID -->
          <FormInput
            v-model="formData.usTaxpayerId"
            label="U.S. Taxpayer ID Number (if applicable)"
            placeholder="12-3456789"
            hint="Only if you have been issued a U.S. Taxpayer ID"
          />

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

// Initialize form data from store
const formData = reactive({
  surname: store.formData.personalInfo.surname,
  givenName: store.formData.personalInfo.givenName,
  fullNameInNativeAlphabet: store.formData.personalInfo.fullNameInNativeAlphabet || '',
  hasOtherNames: store.formData.personalInfo.hasOtherNames,
  otherNames: store.formData.personalInfo.otherNames || [{ surname: '', givenName: '' }],
  dateOfBirth: store.formData.personalInfo.dateOfBirth,
  cityOfBirth: store.formData.personalInfo.cityOfBirth,
  stateOfBirth: store.formData.personalInfo.stateOfBirth || '',
  countryOfBirth: store.formData.personalInfo.countryOfBirth,
  nationality: store.formData.personalInfo.nationality,
  hasOtherNationality: store.formData.personalInfo.hasOtherNationality,
  otherNationalities: store.formData.personalInfo.otherNationalities || [''],
  nationalIdNumber: store.formData.personalInfo.nationalIdNumber || '',
  usSocialSecurityNumber: store.formData.personalInfo.usSocialSecurityNumber || '',
  usTaxpayerId: store.formData.personalInfo.usTaxpayerId || '',
})

// Watch for changes and auto-save
watch(formData, () => {
  store.updateStepData(1, formData)
}, { deep: true })

const countries = [
  'United States', 'China', 'India', 'United Kingdom', 'Canada', 
  'Australia', 'Germany', 'France', 'Japan', 'South Korea',
  'Mexico', 'Brazil', 'Argentina', 'Spain', 'Italy',
  // Add more countries as needed
].sort()

function addOtherName() {
  if (!formData.otherNames) formData.otherNames = []
  formData.otherNames.push({ surname: '', givenName: '' })
}

function removeOtherName(index: number) {
  formData.otherNames?.splice(index, 1)
}

function addOtherNationality() {
  if (!formData.otherNationalities) formData.otherNationalities = []
  formData.otherNationalities.push('')
}

function saveAndContinue() {
  store.updateStepData(1, formData)
  store.goToStep(2)
  router.push('/form/step-2')
}

onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(1)
})
</script>
