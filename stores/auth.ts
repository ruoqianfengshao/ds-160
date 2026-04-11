import { defineStore } from 'pinia'
import type { User, Session, AuthError } from '@supabase/supabase-js'

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

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    session: null,
    profile: null,
    loading: true,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    
    canSync: (state) => {
      if (!state.profile) return false
      return state.profile.sync_count < state.profile.sync_limit
    },
    
    remainingSyncs: (state) => {
      if (!state.profile) return 0
      return Math.max(0, state.profile.sync_limit - state.profile.sync_count)
    },
    
    userEmail: (state) => state.user?.email || null,
    
    isPremium: (state) => state.profile?.plan === 'premium' || state.profile?.plan === 'enterprise',
  },

  actions: {
    // Initialize auth state
    async initialize() {
      const { $supabase } = useNuxtApp()
      if (!$supabase) {
        this.loading = false
        return
      }

      try {
        // Get current session
        const { data: { session }, error } = await $supabase.auth.getSession()
        
        if (error) throw error
        
        if (session) {
          this.session = session
          this.user = session.user
          await this.loadProfile()
        }

        // Listen for auth changes
        $supabase.auth.onAuthStateChange(async (event: string, session: Session | null) => {
          this.session = session
          this.user = session?.user || null
          
          if (session) {
            await this.loadProfile()
          } else {
            this.profile = null
          }
        })
      } catch (error: any) {
        console.error('Auth initialization error:', error)
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    // Load user profile
    async loadProfile() {
      const { $supabase } = useNuxtApp()
      if (!$supabase || !this.user) return

      try {
        const { data, error } = await $supabase
          .from('profiles')
          .select('*')
          .eq('id', this.user.id)
          .single()

        if (error) throw error
        this.profile = data
      } catch (error: any) {
        console.error('Failed to load profile:', error)
        this.error = error.message
      }
    },

    // Sign up
    async signUp(email: string, password: string, fullName: string = '') {
      const { $supabase } = useNuxtApp()
      if (!$supabase) throw new Error('Supabase not configured')

      this.loading = true
      this.error = null

      try {
        const { data, error } = await $supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        })

        if (error) throw error

        if (data.user && data.session) {
          this.user = data.user
          this.session = data.session
          await this.loadProfile()
          return { success: true, message: 'Account created successfully!' }
        } else {
          return { success: true, message: 'Please check your email to confirm your account.' }
        }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Sign in
    async signIn(email: string, password: string) {
      const { $supabase } = useNuxtApp()
      if (!$supabase) throw new Error('Supabase not configured')

      this.loading = true
      this.error = null

      try {
        const { data, error } = await $supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        this.user = data.user
        this.session = data.session
        await this.loadProfile()

        return { success: true }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Sign out
    async signOut() {
      const { $supabase } = useNuxtApp()
      if (!$supabase) return

      this.loading = true

      try {
        const { error } = await $supabase.auth.signOut()
        if (error) throw error

        this.user = null
        this.session = null
        this.profile = null

        // Clear local storage
        if (process.client) {
          localStorage.removeItem('ds160-form-data')
          localStorage.removeItem('ds160-form-meta')
        }

        // Redirect to home
        navigateTo('/')
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update profile
    async updateProfile(updates: Partial<Profile>) {
      const { $supabase } = useNuxtApp()
      if (!$supabase || !this.user) throw new Error('Not authenticated')

      this.loading = true
      this.error = null

      try {
        const { data, error } = await $supabase
          .from('profiles')
          .update(updates)
          .eq('id', this.user.id)
          .select()
          .single()

        if (error) throw error

        this.profile = data
        return { success: true }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Reset password
    async resetPassword(email: string) {
      const { $supabase } = useNuxtApp()
      if (!$supabase) throw new Error('Supabase not configured')

      this.loading = true
      this.error = null

      try {
        const { error } = await $supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) throw error

        return { success: true, message: 'Password reset email sent!' }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update password
    async updatePassword(newPassword: string) {
      const { $supabase } = useNuxtApp()
      if (!$supabase || !this.user) throw new Error('Not authenticated')

      this.loading = true
      this.error = null

      try {
        const { error } = await $supabase.auth.updateUser({
          password: newPassword,
        })

        if (error) throw error

        return { success: true, message: 'Password updated successfully!' }
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Check sync quota
    async checkSyncQuota(): Promise<boolean> {
      const { $supabase } = useNuxtApp()
      if (!$supabase || !this.user) return false

      try {
        const { data, error } = await $supabase.rpc('check_sync_quota', {
          p_user_id: this.user.id,
        })

        if (error) throw error

        // Reload profile to get updated quota
        await this.loadProfile()

        return data
      } catch (error: any) {
        console.error('Failed to check sync quota:', error)
        return false
      }
    },

    // Increment sync count
    async incrementSyncCount(): Promise<boolean> {
      const { $supabase } = useNuxtApp()
      if (!$supabase || !this.user) return false

      try {
        const { data, error } = await $supabase.rpc('increment_sync_count', {
          p_user_id: this.user.id,
        })

        if (error) throw error

        // Reload profile to get updated count
        await this.loadProfile()

        return data
      } catch (error: any) {
        console.error('Failed to increment sync count:', error)
        return false
      }
    },
  },
})
