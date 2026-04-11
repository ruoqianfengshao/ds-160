import { defineStore } from 'pinia'
import type { DS160FormData, DraftMeta, HighRiskField } from '~/types'

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
  }),

  getters: {
    canSync: (state) => state.meta.syncCount < MAX_FREE_SYNCS,
    
    remainingSyncs: (state) => Math.max(0, MAX_FREE_SYNCS - state.meta.syncCount),
    
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
      }
    },

    // Navigate to step
    goToStep(step: number) {
      if (step >= 1 && step <= 12) {
        this.meta.currentStep = step
        this.autoSave()
      }
    },

    // Auto-save to localStorage
    autoSave() {
      if (!this.autoSaveEnabled || !process.client) return

      this.meta.updatedAt = new Date().toISOString()
      this.meta.completionPercentage = this.progress
      this.lastSaveTime = new Date()

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.formData))
        localStorage.setItem(META_STORAGE_KEY, JSON.stringify(this.meta))
      } catch (error) {
        console.error('Failed to auto-save:', error)
      }
    },

    // Sync to cloud (simulated)
    async syncToCloud() {
      if (!this.canSync) {
        throw new Error('Sync limit reached. Please upgrade to premium.')
      }

      this.meta.syncStatus = 'syncing'
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.meta.syncCount++
        this.meta.syncStatus = 'synced'
        this.meta.lastSyncAt = new Date().toISOString()
        this.autoSave()
        
        return { success: true, message: 'Synced successfully' }
      } catch (error) {
        this.meta.syncStatus = 'error'
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
    },
  },
})
