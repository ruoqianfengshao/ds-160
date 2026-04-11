<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-4xl font-bold">Dashboard</h1>
          <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">
            ← Back to Home
          </NuxtLink>
        </div>
        <p class="text-gray-600 text-lg">
          Manage your DS-160 application draft
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">Progress</span>
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-primary-600 mb-1">
            {{ store.progress }}%
          </div>
          <div class="text-sm text-gray-500">
            {{ store.meta.currentStep }} of 12 steps completed
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">Sync Status</span>
            <div class="flex items-center">
              <div 
                class="w-2 h-2 rounded-full mr-2"
                :class="{
                  'bg-green-500': store.meta.syncStatus === 'synced',
                  'bg-yellow-500': store.meta.syncStatus === 'syncing',
                  'bg-gray-400': store.meta.syncStatus === 'local',
                  'bg-red-500': store.meta.syncStatus === 'error',
                }"
              ></div>
              <span class="text-sm capitalize">{{ store.meta.syncStatus }}</span>
            </div>
          </div>
          <div class="text-3xl font-bold mb-1">
            {{ store.remainingSyncs }}
          </div>
          <div class="text-sm text-gray-500">
            free syncs remaining
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">Last Saved</span>
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div class="text-2xl font-bold mb-1">
            {{ lastSavedText }}
          </div>
          <div class="text-sm text-gray-500">
            Auto-save enabled
          </div>
        </div>
      </div>

      <!-- Draft Info Card -->
      <div class="card mb-8">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">Your Application Draft</h2>
            <p class="text-gray-600">
              Draft ID: <span class="font-mono text-sm">{{ store.meta.id }}</span>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Created: {{ formatDate(store.meta.createdAt) }}
            </p>
            <p class="text-sm text-gray-500">
              Last updated: {{ formatDate(store.meta.updatedAt) }}
            </p>
          </div>

          <div class="flex gap-2">
            <button 
              @click="syncDraft"
              :disabled="!store.canSync || isSyncing"
              class="btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': !store.canSync || isSyncing }"
            >
              <svg v-if="!isSyncing" class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="animate-spin w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isSyncing ? 'Syncing...' : 'Sync to Cloud' }}
            </button>

            <button 
              @click="showExportModal = true"
              class="btn-secondary"
            >
              <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Overall Progress</span>
            <span class="font-semibold">{{ store.progress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="bg-primary-600 h-3 rounded-full transition-all duration-500"
              :style="{ width: `${store.progress}%` }"
            ></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4">
          <NuxtLink 
            to="/form/step-1"
            class="btn-primary flex-1 text-center"
          >
            Continue Application
          </NuxtLink>
          
          <button 
            @click="showClearModal = true"
            class="px-6 py-3 border-2 border-red-200 text-red-600 rounded-lg font-medium
                   hover:bg-red-50 transition-all duration-200"
          >
            Clear Data
          </button>
        </div>
      </div>

      <!-- Steps Overview -->
      <div class="card">
        <h2 class="text-2xl font-bold mb-6">Application Steps</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink 
            v-for="step in steps" 
            :key="step.number"
            :to="`/form/step-${step.number}`"
            class="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all duration-200"
            :class="{ 'border-primary-500 bg-primary-50': store.meta.currentStep === step.number }"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold text-gray-500">
                Step {{ step.number }}
              </span>
              <span 
                v-if="isStepCompleted(step.number)"
                class="text-green-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
            <h3 class="font-semibold mb-1">{{ step.title }}</h3>
            <p class="text-sm text-gray-600">{{ step.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div 
      v-if="showExportModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="showExportModal = false"
    >
      <div 
        class="bg-white rounded-xl p-6 max-w-md w-full"
        @click.stop
      >
        <h3 class="text-2xl font-bold mb-4">Export Your Data</h3>
        <p class="text-gray-600 mb-6">
          Download your application data as a JSON file. You can import it later to restore your progress.
        </p>
        <div class="flex gap-4">
          <button 
            @click="exportData"
            class="btn-primary flex-1"
          >
            Download JSON
          </button>
          <button 
            @click="showExportModal = false"
            class="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Clear Data Modal -->
    <div 
      v-if="showClearModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="showClearModal = false"
    >
      <div 
        class="bg-white rounded-xl p-6 max-w-md w-full"
        @click.stop
      >
        <h3 class="text-2xl font-bold mb-4 text-red-600">Clear All Data?</h3>
        <p class="text-gray-600 mb-6">
          This will permanently delete your application draft. This action cannot be undone.
        </p>
        <div class="flex gap-4">
          <button 
            @click="clearData"
            class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium
                   hover:bg-red-700 transition-all duration-200"
          >
            Yes, Clear Data
          </button>
          <button 
            @click="showClearModal = false"
            class="btn-secondary flex-1"
          >
            Cancel
          </button>
        </div>
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
const showExportModal = ref(false)
const showClearModal = ref(false)
const isSyncing = ref(false)

const steps = [
  { number: 1, title: 'Personal Information', description: 'Basic details and names' },
  { number: 2, title: 'Contact Information', description: 'Address and contact details' },
  { number: 3, title: 'Passport Information', description: 'Passport and travel documents' },
  { number: 4, title: 'Travel Information', description: 'Purpose and plans' },
  { number: 5, title: 'Travel Companions', description: 'Who you\'re traveling with' },
  { number: 6, title: 'Previous US Travel', description: 'Past visits and visas' },
  { number: 7, title: 'Family Information', description: 'Parents and relatives' },
  { number: 8, title: 'Work/Education', description: 'Employment and education' },
  { number: 9, title: 'Security Questions (Part 1)', description: 'Health and legal history' },
  { number: 10, title: 'Security Questions (Part 2)', description: 'Immigration history' },
  { number: 11, title: 'Additional Travel', description: 'Countries visited and skills' },
  { number: 12, title: 'Photo Confirmation', description: 'Upload your photo' },
]

const lastSavedText = computed(() => {
  if (!store.lastSaveTime) return 'Never'
  
  const now = new Date()
  const diff = now.getTime() - store.lastSaveTime.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return store.lastSaveTime.toLocaleDateString()
})

function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString()
}

function isStepCompleted(stepNumber: number) {
  // Simple heuristic: if we've moved past this step, consider it "touched"
  return store.meta.currentStep > stepNumber
}

async function syncDraft() {
  if (!store.canSync || isSyncing.value) return
  
  isSyncing.value = true
  try {
    await store.syncToCloud()
    alert('Draft synced successfully!')
  } catch (error) {
    alert('Sync failed. Please try again.')
  } finally {
    isSyncing.value = false
  }
}

function exportData() {
  const data = store.exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ds160-draft-${store.meta.id}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showExportModal.value = false
}

function clearData() {
  store.clearAllData()
  showClearModal.value = false
  alert('All data cleared. Starting fresh!')
}

onMounted(() => {
  store.initializeFromStorage()
})
</script>
