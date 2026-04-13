<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="1" 
      step-title="个人信息"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">个人信息</h2>
        <p class="text-sm text-gray-500 mb-6">Personal Information</p>
        <p class="text-gray-600 mb-8">
          请填写您的个人信息，必须与护照上的信息完全一致。
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Surname -->
          <FormInput
            v-model="formData.surname"
            label="姓"
            secondary-label="Surname / Family Name"
            placeholder="ZHANG"
            required
            field-path="personalInfo.surname"
            hint="填写护照上显示的姓氏（大写拼音）"
          />

          <!-- Given Name -->
          <FormInput
            v-model="formData.givenName"
            label="名"
            secondary-label="Given Name / First Name"
            placeholder="SAN"
            required
            hint="填写护照上显示的名字（大写拼音）"
          />

          <!-- Full Name in Native Alphabet -->
          <FormInput
            v-model="formData.fullNameInNativeAlphabet"
            label="母语全名（如适用）"
            secondary-label="Full Name in Native Alphabet"
            placeholder="张三"
            hint="如果您的母语使用非拉丁字符，请填写"
          />

          <!-- Has Other Names -->
          <FormCheckbox
            v-model="formData.hasOtherNames"
            label="是否曾用过其他名字？"
            secondary-label="Have you ever used other names?"
            field-path="personalInfo.hasOtherNames"
            hint="包括曾用名、别名或更改过的名字"
          />

          <!-- Other Names (conditional) -->
          <div v-if="formData.hasOtherNames" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <div 
              v-for="(name, index) in formData.otherNames" 
              :key="index"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">曾用名 {{ index + 1 }}</h4>
                <button
                  v-if="formData.otherNames && formData.otherNames.length > 1"
                  type="button"
                  @click="removeOtherName(index)"
                  class="text-red-600 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
              
              <FormInput
                v-model="name.surname"
                label="姓"
                secondary-label="Surname"
                placeholder="曾用姓氏"
                no-margin
                class="mb-3"
              />
              
              <FormInput
                v-model="name.givenName"
                label="名"
                secondary-label="Given Name"
                placeholder="曾用名字"
                no-margin
              />
            </div>

            <button
              type="button"
              @click="addOtherName"
              class="btn-secondary w-full"
            >
              + 添加更多曾用名
            </button>
          </div>

          <!-- Date of Birth -->
          <FormInput
            v-model="formData.dateOfBirth"
            type="date"
            label="出生日期"
            secondary-label="Date of Birth"
            required
            hint="格式：年/月/日"
          />

          <!-- City of Birth -->
          <FormInput
            v-model="formData.cityOfBirth"
            label="出生城市"
            secondary-label="City of Birth"
            placeholder="北京"
            required
          />

          <!-- State of Birth (optional) -->
          <FormInput
            v-model="formData.stateOfBirth"
            label="出生省份（如适用）"
            secondary-label="State/Province of Birth"
            placeholder="北京市"
          />

          <!-- Country of Birth -->
          <FormSelect
            v-model="formData.countryOfBirth"
            label="出生国家"
            secondary-label="Country of Birth"
            :options="countries"
            required
            hint="选择您的出生国家"
          />

          <!-- Nationality -->
          <FormSelect
            v-model="formData.nationality"
            label="国籍"
            secondary-label="Nationality"
            :options="countries"
            required
            hint="选择您当前的国籍"
          />

          <!-- Has Other Nationality -->
          <FormCheckbox
            v-model="formData.hasOtherNationality"
            label="是否拥有其他国籍？"
            secondary-label="Do you hold any other nationalities?"
          />

          <!-- Other Nationalities (conditional) -->
          <div v-if="formData.hasOtherNationality" class="pl-8">
            <FormSelect
              v-for="(nat, index) in formData.otherNationalities"
              :key="index"
              v-model="formData.otherNationalities[index]"
              :label="`其他国籍 ${index + 1}`"
              :secondary-label="`Other Nationality ${index + 1}`"
              :options="countries"
            />
            <button
              type="button"
              @click="addOtherNationality"
              class="btn-secondary mt-2"
            >
              + 添加更多国籍
            </button>
          </div>

          <!-- National ID Number -->
          <FormInput
            v-model="formData.nationalIdNumber"
            label="身份证号码（如适用）"
            secondary-label="National Identification Number"
            placeholder="110101199001011234"
            hint="您的身份证或国民身份证号码"
          />

          <!-- US Social Security Number -->
          <FormInput
            v-model="formData.usSocialSecurityNumber"
            label="美国社会安全号（如适用）"
            secondary-label="U.S. Social Security Number"
            placeholder="123-45-6789"
            hint="仅在您已获得美国社会安全号时填写"
          />

          <!-- US Taxpayer ID -->
          <FormInput
            v-model="formData.usTaxpayerId"
            label="美国纳税人识别号（如适用）"
            secondary-label="U.S. Taxpayer ID Number"
            placeholder="12-3456789"
            hint="仅在您已获得美国纳税人识别号时填写"
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
