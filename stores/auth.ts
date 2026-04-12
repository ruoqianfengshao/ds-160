import { defineStore } from 'pinia'

interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  plan: 'free' | 'premium' | 'enterprise'
  sync_count: number
  sync_limit: number
  sync_reset_at: string
  created_at: string
  updated_at: string
}

interface User {
  id: string
  email: string
  profile?: Profile | null
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    
    canSync: (state) => {
      if (!state.user?.profile) return false
      return state.user.profile.sync_count < state.user.profile.sync_limit
    },
    
    remainingSyncs: (state) => {
      if (!state.user?.profile) return 0
      return Math.max(0, state.user.profile.sync_limit - state.user.profile.sync_count)
    },
    
    userEmail: (state) => state.user?.email || null,
    
    isPremium: (state) => 
      state.user?.profile?.plan === 'premium' || 
      state.user?.profile?.plan === 'enterprise',
  },

  actions: {
    // Load current user from server
    async loadUser() {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/user/me')
        this.user = response.user
        return response.user
      } catch (error: any) {
        // User not authenticated - clear state
        this.user = null
        if (error.statusCode !== 401) {
          console.error('Failed to load user:', error)
          this.error = error.message
        }
        return null
      } finally {
        this.loading = false
      }
    },

    // Initialize auth state on app load
    async initialize() {
      await this.loadUser()
    },

    // Sign up (client-side helper, actual signup happens via form submit)
    setUser(user: User) {
      this.user = user
    },

    // Clear user state
    clearUser() {
      this.user = null
      this.error = null
    },

    // Sign out
    async signOut() {
      this.loading = true

      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
        
        this.user = null
        this.error = null

        // Clear local storage
        if (process.client) {
          localStorage.removeItem('ds160-form-data')
          localStorage.removeItem('ds160-form-meta')
        }

        // Redirect to home
        navigateTo('/')
      } catch (error: any) {
        console.error('Logout failed:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update profile
    async updateProfile(updates: Partial<Profile>) {
      if (!this.user) throw new Error('Not authenticated')

      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/user/profile', {
          method: 'PATCH',
          body: updates
        })

        // Reload user to get updated profile
        await this.loadUser()

        return { success: true }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
