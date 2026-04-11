<template>
  <div class="min-h-screen bg-gray-50">
    <FormNavigation :current-step="5" step-title="Travel Companions" />
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Travel Companions</h2>
        <p class="text-gray-600 mb-8">Complete this step to continue.</p>
        <form @submit.prevent="saveAndContinue" class="space-y-6">
          <p class="text-gray-500">Form fields for Travel Companions will be displayed here.</p>
          <div class="text-center py-4 text-gray-500 text-sm">
            <svg class="w-4 h-4 inline mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Auto-saved
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDS160Store } from '~/stores/ds160'
definePageMeta({ layout: 'default' })
const store = useDS160Store()
const router = useRouter()
function saveAndContinue() { 
  const next = 5 + 1
  if (next <= 12) {
    store.goToStep(next)
    router.push('/form/step-' + next)
  } else {
    router.push('/dashboard')
  }
}
onMounted(() => { store.initializeFromStorage(); store.goToStep(5) })
</script>
