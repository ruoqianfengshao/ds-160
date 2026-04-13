<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="3" 
      step-title="旅行同伴"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-2">旅行同伴</h2>
        <p class="text-sm text-gray-500 mb-6">Travel Companions</p>
        <p class="text-gray-600 mb-8">
          请说明是否有其他人与您同行前往美国。
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Are you traveling with others -->
          <FormCheckbox
            v-model="formData.hasTravelCompanions"
            label="是否有其他人与您同行？"
            secondary-label="Are you traveling with other people?"
            hint="包括家人、朋友或团组成员"
          />

          <!-- Travel Companions List (conditional) -->
          <div v-if="formData.hasTravelCompanions" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">同行人员信息</h3>
            <p class="text-sm text-gray-500 mb-4">Information About Travel Companions</p>

            <div 
              v-for="(companion, index) in formData.companions" 
              :key="index"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex justify-between items-center mb-4">
                <h4 class="font-semibold">同行人 {{ index + 1 }}</h4>
                <button
                  v-if="formData.companions && formData.companions.length > 1"
                  type="button"
                  @click="removeCompanion(index)"
                  class="text-red-600 hover:text-red-700 text-sm"
                >
                  删除
                </button>
              </div>
              
              <FormInput
                v-model="companion.surname"
                label="姓"
                secondary-label="Surname"
                placeholder="WANG"
                no-margin
                class="mb-3"
              />
              
              <FormInput
                v-model="companion.givenName"
                label="名"
                secondary-label="Given Name"
                placeholder="MING"
                no-margin
                class="mb-3"
              />

              <FormSelect
                v-model="companion.relationship"
                label="与您的关系"
                secondary-label="Relationship to You"
                :options="relationshipOptions"
                no-margin
              />
            </div>

            <button
              type="button"
              @click="addCompanion"
              class="btn-secondary w-full"
            >
              + 添加更多同行人
            </button>
          </div>

          <!-- Are you part of a group or organization -->
          <FormCheckbox
            v-model="formData.isPartOfGroup"
            label="您是否属于某个团组或组织？"
            secondary-label="Are you traveling as part of a group or organization?"
            hint="例如旅行团、学校团体、宗教组织等"
          />

          <!-- Group Information (conditional) -->
          <div v-if="formData.isPartOfGroup" class="pl-8 space-y-4 border-l-4 border-primary-200">
            <h3 class="text-lg font-semibold mb-2">团组信息</h3>
            <p class="text-sm text-gray-500 mb-4">Group or Organization Information</p>

            <FormInput
              v-model="formData.groupInfo.name"
              label="团组/组织名称"
              secondary-label="Name of Group or Organization"
              placeholder="ABC Travel Group"
              required
            />

            <FormInput
              v-model="formData.groupInfo.type"
              label="团组类型"
              secondary-label="Type of Group"
              placeholder="旅行团/商务团/学生团等"
              hint="例如：旅游团、商务考察团、学术交流团等"
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
  hasTravelCompanions: store.formData.travelCompanions.hasTravelCompanions || false,
  companions: store.formData.travelCompanions.companions || [{ surname: '', givenName: '', relationship: '' }],
  isPartOfGroup: store.formData.travelCompanions.isPartOfGroup || false,
  groupInfo: {
    name: store.formData.travelCompanions.groupInfo?.name || '',
    type: store.formData.travelCompanions.groupInfo?.type || '',
  },
})

watch(formData, () => {
  store.updateStepData(3, formData)
}, { deep: true })

const relationshipOptions = [
  { value: 'Spouse', label: '配偶 (Spouse)' },
  { value: 'Child', label: '子女 (Child)' },
  { value: 'Parent', label: '父母 (Parent)' },
  { value: 'Sibling', label: '兄弟姐妹 (Sibling)' },
  { value: 'Friend', label: '朋友 (Friend)' },
  { value: 'Colleague', label: '同事 (Colleague)' },
  { value: 'Other Relative', label: '其他亲属 (Other Relative)' },
  { value: 'Other', label: '其他 (Other)' },
]

function addCompanion() {
  if (!formData.companions) formData.companions = []
  formData.companions.push({ surname: '', givenName: '', relationship: '' })
}

function removeCompanion(index: number) {
  formData.companions?.splice(index, 1)
}

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
