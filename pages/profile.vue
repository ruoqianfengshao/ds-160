<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <NuxtLink to="/" class="text-xl font-bold text-blue-600">
            DS-160 Helper
          </NuxtLink>
          
          <div class="flex items-center gap-4">
            <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
              <span class="text-sm text-gray-600">
                {{ authStore.userEmail }}
              </span>
              <button
                @click="handleSignOut"
                class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
            <NuxtLink
              v-else
              to="/login"
              class="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Sign In
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Profile Header -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span class="text-3xl font-bold text-blue-600">
                {{ initials }}
              </span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ profile?.full_name || 'User' }}
              </h1>
              <p class="text-gray-600">{{ authStore.userEmail }}</p>
              <div class="mt-2">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="planBadgeClass"
                >
                  {{ profile?.plan?.toUpperCase() || 'FREE' }} Plan
                </span>
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <p class="text-sm text-gray-600">Member since</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ formatDate(profile?.created_at) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Sync Quota -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Sync Quota</h3>
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="mb-2">
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-gray-900">
                {{ authStore.remainingSyncs }}
              </span>
              <span class="text-gray-600">/ {{ profile?.sync_limit || 3 }} left</span>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full transition-all"
              :style="{ width: `${syncProgress}%` }"
            ></div>
          </div>
          <p class="mt-2 text-sm text-gray-500">
            Resets: {{ formatDate(profile?.sync_reset_at) }}
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Drafts</h3>
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">
            {{ ds160Store.allDrafts.length }}
          </div>
          <p class="text-sm text-gray-500">Total saved drafts</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Storage</h3>
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-2">
            Cloud
          </div>
          <p class="text-sm text-gray-500">Auto-sync enabled</p>
        </div>
      </div>

      <!-- Edit Profile -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
        
        <form @submit.prevent="updateProfile" class="space-y-6">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              v-model="formData.full_name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              :value="authStore.userEmail"
              type="email"
              disabled
              class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
            />
            <p class="mt-1 text-xs text-gray-500">Email cannot be changed</p>
          </div>

          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
            
            <button
              type="button"
              @click="showPasswordModal = true"
              class="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>

      <!-- Upgrade CTA -->
      <div v-if="profile?.plan === 'free'" class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold mb-2">Upgrade to Premium</h3>
            <ul class="space-y-1 text-sm">
              <li>✅ Unlimited cloud syncs</li>
              <li>✅ Unlimited drafts</li>
              <li>✅ Priority support</li>
              <li>✅ Version history</li>
            </ul>
          </div>
          <NuxtLink
            to="/pricing"
            class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            View Plans
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <div
      v-if="showPasswordModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showPasswordModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Change Password</h3>
        
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="newPassword"
              v-model="passwordData.newPassword"
              type="password"
              required
              minlength="8"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              v-model="passwordData.confirmPassword"
              type="password"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div v-if="passwordError" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {{ loading ? 'Updating...' : 'Update Password' }}
            </button>
            <button
              type="button"
              @click="showPasswordModal = false"
              class="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useDS160Store } from '~/stores/ds160'

const authStore = useAuthStore()
const ds160Store = useDS160Store()
const router = useRouter()

const profile = computed(() => authStore.profile)
const loading = ref(false)
const showPasswordModal = ref(false)
const passwordError = ref('')

const formData = ref({
  full_name: '',
})

const passwordData = ref({
  newPassword: '',
  confirmPassword: '',
})

const initials = computed(() => {
  const name = profile.value?.full_name || authStore.userEmail || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const planBadgeClass = computed(() => {
  const plan = profile.value?.plan || 'free'
  return {
    free: 'bg-gray-100 text-gray-800',
    premium: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800',
  }[plan]
})

const syncProgress = computed(() => {
  if (!profile.value) return 0
  const used = profile.value.sync_count
  const total = profile.value.sync_limit
  return total > 0 ? (used / total) * 100 : 0
})

const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const updateProfile = async () => {
  loading.value = true
  
  try {
    await authStore.updateProfile(formData.value)
    alert('Profile updated successfully!')
  } catch (error: any) {
    alert('Failed to update profile: ' + error.message)
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  passwordError.value = ''
  
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    passwordError.value = 'Passwords do not match'
    return
  }

  loading.value = true
  
  try {
    await authStore.updatePassword(passwordData.value.newPassword)
    showPasswordModal.value = false
    passwordData.value = { newPassword: '', confirmPassword: '' }
    alert('Password updated successfully!')
  } catch (error: any) {
    passwordError.value = error.message
  } finally {
    loading.value = false
  }
}

const handleSignOut = async () => {
  if (confirm('Are you sure you want to sign out?')) {
    await authStore.signOut()
  }
}

onMounted(async () => {
  // Redirect if not authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  // Load drafts
  await ds160Store.loadAllDrafts()

  // Initialize form
  if (profile.value) {
    formData.value.full_name = profile.value.full_name || ''
  }
})
</script>
