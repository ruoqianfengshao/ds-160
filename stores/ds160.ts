import { defineStore } from 'pinia'
import type { DS160FormData, DraftMeta, HighRiskField } from '~/types'
import { useAuthStore } from './auth'

const STORAGE_KEY = 'ds160-form-data'
const META_STORAGE_KEY = 'ds160-form-meta'
const MAX_FREE_SYNCS = 3

// High-risk fields that need special attention
const HIGH_RISK_FIELDS: HighRiskField[] = [
  {
    field: 'personalInfo.hasOtherNames',
    reason: 'Must match official documents exactly',
    tips: ['Include all names ever used', 'Check spelling carefully', 'Include maiden names if applicable']
  },
  {
    field: 'passportInfo.passportNumber',
    reason: 'Critical identification field',
    tips: ['Verify against physical passport', 'No spaces or special characters', 'Double-check each digit']
  },
  {
    field: 'travelInfo.addressInUS',
    reason: 'Must be verifiable address',
    tips: ['Use complete street address', 'Include apartment/suite number', 'Verify with host']
  },
  {
    field: 'previousUSTravel.hasBeenRefusedUSVisa',
    reason: 'Requires detailed explanation',
    tips: ['Be honest and complete', 'Explain circumstances clearly', 'Provide dates and reasons']
  },
  {
    field: 'securityQuestions1.hasArrestRecord',
    reason: 'Legal implications',
    tips: ['Include all arrests even if dismissed', 'Provide complete details', 'Attach supporting documents']
  },
]

// Debounce helper
let syncDebounceTimer: NodeJS.Timeout | null = null

export const useDS160Store = defineStore('ds160', {
  state: () => ({
    formData: {
      personalInfo: {
        surname: '',
        givenName: '',
        hasOtherNames: false,
        dateOfBirth: '',
        cityOfBirth: '',
        countryOfBirth: '',
        nationality: '',
        hasOtherNationality: false,
      },
      contactInfo: {
        homeAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        phoneNumber: '',
        email: '',
      },
      passportInfo: {
        passportNumber: '',
        countryOfIssuance: '',
        issuanceCity: '',
        issuanceCountry: '',
        issuanceDate: '',
        expirationDate: '',
        hasLostPassport: false,
      },
      travelInfo: {
        purposeOfTrip: '',
        whoIsPaying: '',
        hasOtherPersonPaying: false,
      },
      travelCompanions: {
        hasTravelCompanions: false,
        isPartOfGroup: false,
      },
      previousUSTravel: {
        hasBeenToUS: false,
        hasBeenIssuedUSVisa: false,
        hasBeenRefusedUSVisa: false,
        hasBeenRefusedUSEntry: false,
        hasHadVisaCancelled: false,
      },
      familyInfo: {
        fatherInfo: {
          surname: '',
          givenName: '',
          dateOfBirth: '',
          isInUS: false,
        },
        motherInfo: {
          surname: '',
          givenName: '',
          dateOfBirth: '',
          isInUS: false,
        },
        hasImmediateRelativesInUS: false,
        maritalStatus: '',
      },
      workEducation: {
        primaryOccupation: '',
        hasAdditionalWorkEducation: false,
        educationLevel: '',
      },
      securityQuestions1: {
        hasCommunicableDisease: false,
        hasMentalDisorder: false,
        isDrugAbuser: false,
        hasArrestRecord: false,
        hasViolatedControlledSubstanceLaw: false,
        isEngagedInProstitution: false,
        hasEngagedInMoneyLaundering: false,
        hasEngagedInHumanTrafficking: false,
        hasAssistedInHumanTrafficking: false,
        isRelatedToHumanTrafficker: false,
      },
      securityQuestions2: {
        hasSoughtImmunity: false,
        hasWithheldChildCustody: false,
        hasVotedUnlawfully: false,
        hasRenouncedCitizenshipForTax: false,
        hasBeenRemoved: false,
        hasViolatedImmigrationLaw: false,
        hasCausedImmigrationViolation: false,
        hasAssertedFalseClaim: false,
        hasFraudulentlyObtainedBenefit: false,
        isSubjectToCivilPenalty: false,
        hasCausedSeriousHarm: false,
        isChildAbductor: false,
      },
      additionalTravel: {
        hasSpecializedSkills: false,
        hasServedInMilitary: false,
        hasParticipatedInParamilitary: false,
        hasWorkedForIntelligence: false,
      },
      photoConfirmation: {
        photoUploaded: false,
        photoMeetsRequirements: false,
      },
    } as DS160FormData,
    
    meta: {
      id: '',
      createdAt: '',
      updatedAt: '',
      currentStep: 1,
      completionPercentage: 0,
      syncStatus: 'local',
      syncCount: 0,
    } as DraftMeta,

    autoSaveEnabled: true,
    lastSaveTime: null as Date | null,
    isSyncing: false,
    allDrafts: [] as any[], // For dashboard
  }),

  getters: {
    canSync: (state) => {
      const authStore = useAuthStore()
      return authStore.isAuthenticated && authStore.canSync
    },
    
    remainingSyncs: () => {
      const authStore = useAuthStore()
      return authStore.remainingSyncs
    },
    
    isHighRiskField: () => (fieldPath: string): HighRiskField | undefined => {
      return HIGH_RISK_FIELDS.find(f => f.field === fieldPath)
    },

    currentStepData: (state) => {
      const stepMap: Record<number, keyof DS160FormData> = {
        1: 'personalInfo',
        2: 'contactInfo',
        3: 'passportInfo',
        4: 'travelInfo',
        5: 'travelCompanions',
        6: 'previousUSTravel',
        7: 'familyInfo',
        8: 'workEducation',
        9: 'securityQuestions1',
        10: 'securityQuestions2',
        11: 'additionalTravel',
        12: 'photoConfirmation',
      }
      const key = stepMap[state.meta.currentStep]
      return key ? state.formData[key] : null
    },

    progress: (state) => {
      // Calculate completion based on required fields filled
      let totalFields = 0
      let filledFields = 0

      const countFields = (obj: any) => {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            countFields(obj[key])
          } else if (typeof obj[key] === 'string') {
            totalFields++
            if (obj[key] && obj[key].trim() !== '') filledFields++
          } else if (typeof obj[key] === 'boolean') {
            totalFields++
            filledFields++ // Booleans always count as filled
          }
        }
      }

      countFields(state.formData)
      return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
    },
  },

  actions: {
    // Initialize from localStorage or database
    async initialize() {
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        // Load from database
        await this.loadCurrentDraft()
      } else {
        // Load from localStorage
        this.initializeFromStorage()
      }
    },

    // Initialize from localStorage
    initializeFromStorage() {
      if (process.client) {
        const savedData = localStorage.getItem(STORAGE_KEY)
        const savedMeta = localStorage.getItem(META_STORAGE_KEY)
        
        if (savedData) {
          try {
            this.formData = JSON.parse(savedData)
          } catch (error) {
            console.error('Failed to parse saved form data:', error)
          }
        }
        
        if (savedMeta) {
          try {
            this.meta = JSON.parse(savedMeta)
          } catch (error) {
            console.error('Failed to parse saved meta data:', error)
          }
        } else {
          // Initialize new draft
          this.meta = {
            id: `draft-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            currentStep: 1,
            completionPercentage: 0,
            syncStatus: 'local',
            syncCount: 0,
          }
        }
      }
    },

    // Load current draft from database
    async loadCurrentDraft() {
      const { $supabase } = useNuxtApp()
      const authStore = useAuthStore()
      
      if (!$supabase || !authStore.user) return

      try {
        const { data, error } = await $supabase
          .from('ds160_drafts')
          .select('*')
          .eq('user_id', authStore.user.id)
          .eq('status', 'draft')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
          throw error
        }

        if (data) {
          // Load from database
          this.formData = data.form_data
          this.meta = {
            id: data.id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            currentStep: data.current_step,
            completionPercentage: data.completion_percentage,
            syncStatus: 'synced',
            syncCount: authStore.profile?.sync_count || 0,
            lastSyncAt: data.last_synced_at,
          }
          
          // Also save to localStorage for offline access
          this.saveToLocalStorage()
        } else {
          // No draft in database, try localStorage
          this.initializeFromStorage()
          
          // If has data, sync to database
          if (this.meta.id) {
            await this.syncToCloud()
          }
        }
      } catch (error) {
        console.error('Failed to load draft from database:', error)
        // Fallback to localStorage
        this.initializeFromStorage()
      }
    },

    // Load all drafts for dashboard
    async loadAllDrafts() {
      const { $supabase } = useNuxtApp()
      const authStore = useAuthStore()
      
      if (!$supabase || !authStore.user) return

      try {
        const { data, error } = await $supabase
          .from('ds160_drafts')
          .select('*')
          .eq('user_id', authStore.user.id)
          .order('updated_at', { ascending: false })

        if (error) throw error

        this.allDrafts = data || []
      } catch (error) {
        console.error('Failed to load drafts:', error)
      }
    },

    // Load specific draft
    async loadDraft(draftId: string) {
      const { $supabase } = useNuxtApp()
      const authStore = useAuthStore()
      
      if (!$supabase || !authStore.user) return

      try {
        const { data, error } = await $supabase
          .from('ds160_drafts')
          .select('*')
          .eq('id', draftId)
          .eq('user_id', authStore.user.id)
          .single()

        if (error) throw error

        if (data) {
          this.formData = data.form_data
          this.meta = {
            id: data.id,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            currentStep: data.current_step,
            completionPercentage: data.completion_percentage,
            syncStatus: 'synced',
            syncCount: authStore.profile?.sync_count || 0,
            lastSyncAt: data.last_synced_at,
          }
          
          this.saveToLocalStorage()
        }
      } catch (error) {
        console.error('Failed to load draft:', error)
        throw error
      }
    },

    // Create new draft
    async createNewDraft(title: string = 'DS-160 Draft') {
      const { $supabase } = useNuxtApp()
      const authStore = useAuthStore()
      
      if (!$supabase || !authStore.user) return

      try {
        const { data, error } = await $supabase
          .from('ds160_drafts')
          .insert({
            user_id: authStore.user.id,
            title,
            form_data: this.formData,
            current_step: 1,
            completion_percentage: 0,
            status: 'draft',
          })
          .select()
          .single()

        if (error) throw error

        if (data) {
          this.meta.id = data.id
          this.meta.createdAt = data.created_at
          this.meta.updatedAt = data.updated_at
          this.meta.syncStatus = 'synced'
          
          this.saveToLocalStorage()
        }

        return data
      } catch (error) {
        console.error('Failed to create draft:', error)
        throw error
      }
    },

    // Update form data for a specific step
    updateStepData(step: number, data: any) {
      const stepMap: Record<number, keyof DS160FormData> = {
        1: 'personalInfo',
        2: 'contactInfo',
        3: 'passportInfo',
        4: 'travelInfo',
        5: 'travelCompanions',
        6: 'previousUSTravel',
        7: 'familyInfo',
        8: 'workEducation',
        9: 'securityQuestions1',
        10: 'securityQuestions2',
        11: 'additionalTravel',
        12: 'photoConfirmation',
      }
      
      const key = stepMap[step]
      if (key) {
        this.formData[key] = { ...this.formData[key], ...data }
        this.autoSave()
        this.debouncedSyncToCloud()
      }
    },

    // Navigate to step
    goToStep(step: number) {
      if (step >= 1 && step <= 12) {
        this.meta.currentStep = step
        this.autoSave()
        this.debouncedSyncToCloud()
      }
    },

    // Save to localStorage
    saveToLocalStorage() {
      if (!process.client) return

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.formData))
        localStorage.setItem(META_STORAGE_KEY, JSON.stringify(this.meta))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
    },

    // Auto-save to localStorage
    autoSave() {
      if (!this.autoSaveEnabled || !process.client) return

      this.meta.updatedAt = new Date().toISOString()
      this.meta.completionPercentage = this.progress
      this.lastSaveTime = new Date()

      this.saveToLocalStorage()
    },

    // Debounced sync to cloud (2 seconds)
    debouncedSyncToCloud() {
      const authStore = useAuthStore()
      
      if (!authStore.isAuthenticated) return

      if (syncDebounceTimer) {
        clearTimeout(syncDebounceTimer)
      }

      syncDebounceTimer = setTimeout(() => {
        this.syncToCloud()
      }, 2000)
    },

    // Sync to cloud
    async syncToCloud(force: boolean = false) {
      const { $supabase } = useNuxtApp()
      const authStore = useAuthStore()
      
      if (!$supabase || !authStore.user) {
        console.log('Not authenticated, skipping sync')
        return
      }

      // Don't sync if already syncing
      if (this.isSyncing) return

      // Check if need to count against quota
      const shouldCount = force || !this.meta.lastSyncAt || 
        (Date.now() - new Date(this.meta.lastSyncAt).getTime() > 60000) // 1 minute

      if (shouldCount && !authStore.canSync && !authStore.isPremium) {
        throw new Error('Sync limit reached. Please upgrade to premium.')
      }

      this.isSyncing = true
      this.meta.syncStatus = 'syncing'

      try {
        // Update or insert draft
        const draftData = {
          user_id: authStore.user.id,
          form_data: this.formData,
          current_step: this.meta.currentStep,
          completion_percentage: this.progress,
          status: 'draft',
          last_synced_at: new Date().toISOString(),
        }

        let result
        if (this.meta.id && !this.meta.id.startsWith('draft-')) {
          // Update existing
          result = await $supabase
            .from('ds160_drafts')
            .update(draftData)
            .eq('id', this.meta.id)
            .select()
            .single()
        } else {
          // Insert new
          result = await $supabase
            .from('ds160_drafts')
            .insert(draftData)
            .select()
            .single()
        }

        const { data, error } = result

        if (error) throw error

        if (data) {
          this.meta.id = data.id
          this.meta.updatedAt = data.updated_at
          this.meta.lastSyncAt = data.last_synced_at
          this.meta.syncStatus = 'synced'
          
          // Increment sync count if needed
          if (shouldCount && !authStore.isPremium) {
            await authStore.incrementSyncCount()
          }

          // Log sync history
          await $supabase.from('sync_history').insert({
            user_id: authStore.user.id,
            draft_id: data.id,
            action: 'sync',
          })

          this.saveToLocalStorage()
        }

        return { success: true, message: 'Synced successfully' }
      } catch (error: any) {
        console.error('Sync failed:', error)
        this.meta.syncStatus = 'error'
        throw error
      } finally {
        this.isSyncing = false
      }
    },

    // Delete draft
    async deleteDraft(draftId: string) {
      const { $supabase } = useNuxtApp()
      const authStore = useAuthStore()
      
      if (!$supabase || !authStore.user) return

      try {
        const { error } = await $supabase
          .from('ds160_drafts')
          .delete()
          .eq('id', draftId)
          .eq('user_id', authStore.user.id)

        if (error) throw error

        // Log deletion
        await $supabase.from('sync_history').insert({
          user_id: authStore.user.id,
          draft_id: draftId,
          action: 'delete',
        })

        // Reload drafts
        await this.loadAllDrafts()

        return { success: true }
      } catch (error) {
        console.error('Failed to delete draft:', error)
        throw error
      }
    },

    // Clear all data
    clearAllData() {
      if (process.client) {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(META_STORAGE_KEY)
      }
      
      // Reset to initial state
      this.$reset()
      this.initializeFromStorage()
    },

    // Export data
    exportData() {
      return {
        formData: this.formData,
        meta: this.meta,
        exportedAt: new Date().toISOString(),
      }
    },

    // Import data
    importData(data: any) {
      if (data.formData) {
        this.formData = data.formData
      }
      if (data.meta) {
        this.meta = { ...data.meta, syncStatus: 'local' as const }
      }
      this.autoSave()
      this.debouncedSyncToCloud()
    },
  },
})
