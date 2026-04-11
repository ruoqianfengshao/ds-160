<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation 
      :current-step="stepNumber" 
      :step-title="stepTitle"
    />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">{{ stepTitle }}</h2>
        <p class="text-gray-600 mb-8">
          {{ stepDescription }}
        </p>

        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <!-- Dynamic form fields will be inserted here based on step -->
          <slot />

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

interface Props {
  stepNumber: number
  stepTitle: string
  stepDescription: string
  formDataKey: string
}

const props = defineProps<Props>()
const store = useDS160Store()
const router = useRouter()

function saveAndContinue() {
  const nextStep = props.stepNumber + 1
  if (nextStep <= 12) {
    store.goToStep(nextStep)
    router.push(`/form/step-${nextStep}`)
  } else {
    router.push('/dashboard')
  }
}

onMounted(() => {
  store.initializeFromStorage()
  store.goToStep(props.stepNumber)
})
</script>
