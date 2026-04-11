<template>
  <div class="sticky top-16 bg-white border-b border-gray-200 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Progress bar -->
      <div class="py-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600">Step {{ currentStep }} of 12</span>
          <span class="font-semibold text-primary-600">{{ progress }}% Complete</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-primary-600 h-2 rounded-full transition-all duration-500"
            :style="{ width: `${(currentStep / 12) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center justify-between py-4 border-t border-gray-100">
        <button
          v-if="currentStep > 1"
          @click="goToPreviousStep"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <NuxtLink
          v-else
          to="/dashboard"
          class="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </NuxtLink>

        <div class="flex-1 text-center">
          <h2 class="text-lg font-semibold text-gray-900">
            {{ stepTitle }}
          </h2>
        </div>

        <button
          v-if="currentStep < 12"
          @click="goToNextStep"
          class="btn-primary flex items-center"
        >
          Next
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          v-else
          @click="completeApplication"
          class="btn-primary flex items-center"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Complete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDS160Store } from '~/stores/ds160'

interface Props {
  currentStep: number
  stepTitle: string
}

const props = defineProps<Props>()
const store = useDS160Store()
const router = useRouter()

const progress = computed(() => store.progress)

function goToPreviousStep() {
  if (props.currentStep > 1) {
    router.push(`/form/step-${props.currentStep - 1}`)
  }
}

function goToNextStep() {
  if (props.currentStep < 12) {
    store.goToStep(props.currentStep + 1)
    router.push(`/form/step-${props.currentStep + 1}`)
  }
}

function completeApplication() {
  // In a real app, this would submit the form
  alert('Application completed! In a real app, this would submit your data to the DS-160 system.')
  router.push('/dashboard')
}
</script>
