<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-4xl font-bold">Dashboard</h1>
          <div class="flex items-center gap-4">
            <NuxtLink
              v-if="authStore.isAuthenticated"
              to="/profile"
              class="text-gray-600 hover:text-gray-900"
            >
              Profile
            </NuxtLink>
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">
              ← Back to Home
            </NuxtLink>
          </div>
        </div>
        <p class="text-gray-600 text-lg">
          {{ authStore.isAuthenticated ? 'Manage your DS-160 applications' : 'Manage your DS-160 application draft' }}
        </p>
      </div>

      <!-- Auth Notice (if not logged in) -->
      <div v-if="!authStore.isAuthenticated" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-900 mb-2">Sign in to unlock more features</h3>
            <ul class="text-sm text-blue-800 space-y-1 mb-4">
              <li>✓ Save multiple drafts</li>
              <li>✓ Access from any device</li>
              <li>✓ Auto-sync to cloud</li>
              <li>✓ Free: 3 syncs per month</li>
            </ul>
            <div class="flex gap-3">
              <NuxtLink to="/signup" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Create Free Account
              </NuxtLink>
              <NuxtLink to="/login" class="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition">
                Sign In
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">Current Progress</span>
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-primary-600 mb-1">
            {{ store.progress }}%
          </div>
          <div class="text-sm text-gray-500">
            {{ store.meta.currentStep }} of 12 steps
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-600">Total Drafts</span>
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-green-600 mb-1">
            {{ authStore.isAuthenticated ? store.allDrafts.length : 1 }}
          </div>
          <div class="text-sm text-gray-500">
            {{ authStore.isAuthenticated ? 'Saved in cloud' : 'Saved locally' }}
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
            {{ authStore.isAuthenticated ? authStore.remainingSyncs : 'N/A' }}
          </div>
          <div class="text-sm text-gray-500">
            {{ authStore.isAuthenticated ? 'syncs remaining' : 'Sign in to sync' }}
          </div>
        </div>
      </div>

      <!-- All Drafts List (if authenticated) -->
      <div v-if="authStore.isAuthenticated && store.allDrafts.length > 0" class="card mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Your Drafts</h2>
          <button
            @click="createNewDraft"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + New Draft
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="draft in store.allDrafts"
            :key="draft.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition cursor-pointer"
            :class="{ 'border-blue-500 bg-blue-50': draft.id === store.meta.id }"
            @click="loadDraft(draft.id)"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">{{ draft.title || 'DS-160 Draft' }}</h3>
                <p class="text-sm text-gray-500">
                  Step {{ draft.current_step }}/12 • {{ draft.completion_percentage }}%
                </p>
              </div>
              <button
                @click.stop="confirmDeleteDraft(draft.id)"
                class="text-gray-400 hover:text-red-600 transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div class="mb-3">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all"
                  :style="{ width: `${draft.completion_percentage}%` }"
                ></div>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ formatDate(draft.updated_at) }}</span>
              <span class="px-2 py-1 bg-gray-100 rounded-full">
                {{ draft.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Current Draft Info Card -->
      <div class="card mb-8">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold mb-2">
              {{ store.allDrafts.find(d => d.id === store.meta.id)?.title || 'Current Application Draft' }}
            </h2>
            <p class="text-gray-600">
              Draft ID: <span class="font-mono text-sm">{{ store.meta.id }}</span>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              Created: {{ formatDate(store.meta.createdAt) }}
            </p>
            <p class="text-sm text-gray-500">
              Last updated: {{ formatDate(store.meta.updatedAt) }}
            </p>
            <p v-if="store.meta.lastSyncAt" class="text-sm text-gray-500">
              Last synced: {{ formatDate(store.meta.lastSyncAt) }}
            </p>
          </div>

          <div class="flex gap-2">
            <button 
              v-if="authStore.isAuthenticated"
              @click="syncDraft"
              :disabled="!store.canSync || store.isSyncing"
              class="btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': !store.canSync || store.isSyncing }"
            >
              <svg v-if="!store.isSyncing" class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <svg v-else class="animate-spin w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ store.isSyncing ? 'Syncing...' : 'Sync to Cloud' }}
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
        <h3 class="text-2xl font-bold mb-4 text-red-600">Clear Current Draft?</h3>
        <p class="text-gray-600 mb-6">
          This will permanently delete the current application draft. This action cannot be undone.
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

    <!-- Delete Draft Confirmation -->
    <div 
      v-if="draftToDelete"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click="draftToDelete = null"
    >
      <div 
        class="bg-white rounded-xl p-6 max-w-md w-full"
        @click.stop
      >
        <h3 class="text-2xl font-bold mb-4 text-red-600">Delete Draft?</h3>
        <p class="text-gray-600 mb-6">
          This will permanently delete this draft. This action cannot be undone.
        </p>
        <div class="flex gap-4">
          <button 
            @click="deleteDraft"
            class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium
                   hover:bg-red-700 transition-all duration-200"
          >
            Yes, Delete
          </button>
          <button 
            @click="draftToDelete = null"
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
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'default'
})

const store = useDS160Store()
const authStore = useAuthStore()
const router = useRouter()

const showExportModal = ref(false)
const showClearModal = ref(false)
const draftToDelete = ref<string | null>(null)

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

function formatDate(dateString: string) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (hours < 48) return 'Yesterday'
  return date.toLocaleDateString()
}

function isStepCompleted(stepNumber: number) {
  return store.meta.currentStep > stepNumber
}

async function syncDraft() {
  if (!store.canSync || store.isSyncing) return
  
  try {
    await store.syncToCloud(true) // Force sync with count
    alert('Draft synced successfully!')
  } catch (error: any) {
    alert(error.message || 'Sync failed. Please try again.')
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
  alert('Current draft cleared!')
}

async function loadDraft(draftId: string) {
  try {
    await store.loadDraft(draftId)
    router.push('/form/step-1')
  } catch (error) {
    alert('Failed to load draft')
  }
}

async function createNewDraft() {
  try {
    // Save current data if any
    if (store.meta.id) {
      await store.syncToCloud()
    }
    
    // Reset form
    store.clearAllData()
    
    // Create new draft in database
    await store.createNewDraft('DS-160 Draft')
    
    alert('New draft created!')
    await store.loadAllDrafts()
  } catch (error: any) {
    alert(error.message || 'Failed to create new draft')
  }
}

function confirmDeleteDraft(draftId: string) {
  draftToDelete.value = draftId
}

async function deleteDraft() {
  if (!draftToDelete.value) return
  
  try {
    await store.deleteDraft(draftToDelete.value)
    alert('Draft deleted successfully')
    
    // If deleted current draft, load another or create new
    if (draftToDelete.value === store.meta.id) {
      if (store.allDrafts.length > 0) {
        await loadDraft(store.allDrafts[0].id)
      } else {
        store.clearAllData()
      }
    }
  } catch (error) {
    alert('Failed to delete draft')
  } finally {
    draftToDelete.value = null
  }
}

onMounted(async () => {
  // Initialize store
  await store.initialize()
  
  // Load all drafts if authenticated
  if (authStore.isAuthenticated) {
    await store.loadAllDrafts()
  }
})
</script>
