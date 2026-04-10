import { defineStore } from 'pinia'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface Draft {
  id: string
  createdAt: string
  updatedAt: string
  currentStep: number
  data: FormData
  syncCount: number
  status: 'draft' | 'completed' | 'synced'
}

export interface FormData {
  // Step 1: 个人信息
  personalInfo: {
    fullName: string
    givenName: string
    familyName: string
    otherNames: string
    sex: string
    dateOfBirth: string
    cityOfBirth: string
    countryOfBirth: string
    nationality: string
    nationalIdNumber: string
  }
  
  // Step 2: 护照信息
  passportInfo: {
    passportNumber: string
    passportBookNumber: string
    countryOfIssuance: string
    issueDate: string
    expirationDate: string
    passportTaken: string
  }
  
  // Step 3: 联系方式
  contactInfo: {
    streetAddress: string
    city: string
    state: string
    postalCode: string
    country: string
    phoneNumber: string
    secondaryPhone: string
    emailAddress: string
  }
  
  // Step 4: 旅行信息
  travelInfo: {
    purposeOfTrip: string
    specificPurpose: string
    otherPurpose: string
    expectedArrivalDate: string
    expectedDepartureDate: string
    intendedLengthOfStay: string
    placeToBeVisited: string
    statesToBeVisited: string
  }
  
  // Step 5: 旅行伙伴
  travelCompanion: {
    isTravelingWithSomeone: string
    companionName: string
    companionRelationship: string
    companionAddress: string
  }
  
  // Step 6: 美国联系人
  usContact: {
    hasUsContact: string
    contactName: string
    contactOrganization: string
    contactAddress: string
    contactPhone: string
    contactEmail: string
  }
  
  // Step 7: 家庭信息
  familyInfo: {
    // 父亲
    fatherFirstName: string
    fatherLastName: string
    fatherDateOfBirth: string
    fatherCityOfBirth: string
    fatherCountryOfBirth: string
    // 母亲
    motherFirstName: string
    motherLastName: string
    motherDateOfBirth: string
    motherCityOfBirth: string
    motherCountryOfBirth: string
    // 配偶
    hasSpouse: string
    spouseFirstName: string
    spouseLastName: string
    spouseDateOfBirth: string
    spouseNationality: string
    spousePlaceOfBirth: string
    // 子女
    hasChildren: string
    childrenInfo: Array<{
      name: string
      dateOfBirth: string
      countryOfBirth: string
    }>
  }
  
  // Step 8: 工作/教育
  workEducation: {
    presentOccupation: string
    otherOccupation: string
    employerName: string
    employerAddress: string
    employerPhone: string
    monthlyIncome: string
    DUTies: string
    supervisorName: string
    supervisorPhone: string
    // 教育背景
    hasEducation: string
    highestEducation: string
    schoolName: string
    schoolAddress: string
    fieldOfStudy: string
    fromDate: string
    toDate: string
  }
  
  // Step 9: 安全问题1
  securityQuestions1: {
    // 公职相关
    hasGovernmentRole: string
    governmentDetails: string
    // 犯罪记录
    hasCriminalRecord: string
    criminalDetails: string
    // 违反法律
    hasViolatedLaw: string
    violationDetails: string
    // 寻求非法入境
    seekingUnlawfulEntry: string
  }
  
  // Step 10: 安全问题2
  securityQuestions2: {
    // 恐怖主义
    hasTerrorismConnection: string
    terrorismDetails: string
    // 暴力行为
    hasViolentBehavior: string
    violenceDetails: string
    // 毒品相关
    hasDrugRelated: string
    drugDetails: string
    // 传染病
    hasCommunicableDisease: string
    diseaseDetails: string
    // 精神健康
    hasMentalHealthIssue: string
    mentalHealthDetails: string
  }
  
  // Step 11: 以往旅行
  previousTravel: {
    // 之前是否去过美国
    previousUsVisit: string
    previousVisitDates: string
    previousVisaType: string
    previousVisaNumber: string
    // 是否被拒签
    previousVisaDenial: string
    denialDetails: string
    // 是否持有美国签证
    currentUsVisa: string
    currentVisaType: string
    currentVisaNumber: string
    visaIssueDate: string
    // 是否申请过移民
    immigrationApplication: string
    immigrationDetails: string
  }
  
  // Step 12: 照片
  photoInfo: {
    hasDigitalPhoto: string
    photoPath: string
    photoConfirmed: string
  }
}

const createEmptyFormData = (): FormData => ({
  personalInfo: {
    fullName: '',
    givenName: '',
    familyName: '',
    otherNames: '',
    sex: '',
    dateOfBirth: '',
    cityOfBirth: '',
    countryOfBirth: '',
    nationality: '',
    nationalIdNumber: ''
  },
  passportInfo: {
    passportNumber: '',
    passportBookNumber: '',
    countryOfIssuance: '',
    issueDate: '',
    expirationDate: '',
    passportTaken: ''
  },
  contactInfo: {
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phoneNumber: '',
    secondaryPhone: '',
    emailAddress: ''
  },
  travelInfo: {
    purposeOfTrip: '',
    specificPurpose: '',
    otherPurpose: '',
    expectedArrivalDate: '',
    expectedDepartureDate: '',
    intendedLengthOfStay: '',
    placeToBeVisited: '',
    statesToBeVisited: ''
  },
  travelCompanion: {
    isTravelingWithSomeone: '',
    companionName: '',
    companionRelationship: '',
    companionAddress: ''
  },
  usContact: {
    hasUsContact: '',
    contactName: '',
    contactOrganization: '',
    contactAddress: '',
    contactPhone: '',
    contactEmail: ''
  },
  familyInfo: {
    fatherFirstName: '',
    fatherLastName: '',
    fatherDateOfBirth: '',
    fatherCityOfBirth: '',
    fatherCountryOfBirth: '',
    motherFirstName: '',
    motherLastName: '',
    motherDateOfBirth: '',
    motherCityOfBirth: '',
    motherCountryOfBirth: '',
    hasSpouse: '',
    spouseFirstName: '',
    spouseLastName: '',
    spouseDateOfBirth: '',
    spouseNationality: '',
    spousePlaceOfBirth: '',
    hasChildren: '',
    childrenInfo: []
  },
  workEducation: {
    presentOccupation: '',
    otherOccupation: '',
    employerName: '',
    employerAddress: '',
    employerPhone: '',
    monthlyIncome: '',
    DUTies: '',
    supervisorName: '',
    supervisorPhone: '',
    hasEducation: '',
    highestEducation: '',
    schoolName: '',
    schoolAddress: '',
    fieldOfStudy: '',
    fromDate: '',
    toDate: ''
  },
  securityQuestions1: {
    hasGovernmentRole: '',
    governmentDetails: '',
    hasCriminalRecord: '',
    criminalDetails: '',
    hasViolatedLaw: '',
    violationDetails: '',
    seekingUnlawfulEntry: ''
  },
  securityQuestions2: {
    hasTerrorismConnection: '',
    terrorismDetails: '',
    hasViolentBehavior: '',
    violenceDetails: '',
    hasDrugRelated: '',
    drugDetails: '',
    hasCommunicableDisease: '',
    diseaseDetails: '',
    hasMentalHealthIssue: '',
    mentalHealthDetails: ''
  },
  previousTravel: {
    previousUsVisit: '',
    previousVisitDates: '',
    previousVisaType: '',
    previousVisaNumber: '',
    previousVisaDenial: '',
    denialDetails: '',
    currentUsVisa: '',
    currentVisaType: '',
    currentVisaNumber: '',
    visaIssueDate: '',
    immigrationApplication: '',
    immigrationDetails: ''
  },
  photoInfo: {
    hasDigitalPhoto: '',
    photoPath: '',
    photoConfirmed: ''
  }
})

const STORAGE_KEY = 'ds160-draft'

export const useFormStore = defineStore('form', {
  state: () => ({
    currentDraft: null as Draft | null,
    currentStep: 1,
    saveStatus: 'idle' as SaveStatus,
    syncCount: 0,
    syncInProgress: false,
    syncSuccess: false
  }),
  
  getters: {
    formData: (state) => state.currentDraft?.data || createEmptyFormData(),
    
    currentStepData: (state) => {
      const stepMap: Record<number, keyof FormData> = {
        1: 'personalInfo',
        2: 'passportInfo',
        3: 'contactInfo',
        4: 'travelInfo',
        5: 'travelCompanion',
        6: 'usContact',
        7: 'familyInfo',
        8: 'workEducation',
        9: 'securityQuestions1',
        10: 'securityQuestions2',
        11: 'previousTravel',
        12: 'photoInfo'
      }
      return stepMap[state.currentStep] || 'personalInfo'
    },
    
    progress: (state) => Math.round((state.currentStep / 12) * 100),
    
    isDraftSaved: (state) => state.currentDraft !== null
  },
  
  actions: {
    createNewDraft() {
      const draft: Draft = {
        id: `draft-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStep: 1,
        data: createEmptyFormData(),
        syncCount: 0,
        status: 'draft'
      }
      this.currentDraft = draft
      this.currentStep = 1
      this.syncCount = 0
      this.saveDraft()
      return draft
    },
    
    loadDraft(): Draft | null {
      if (import.meta.client) {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          try {
            const draft = JSON.parse(stored) as Draft
            this.currentDraft = draft
            this.currentStep = draft.currentStep
            this.syncCount = draft.syncCount
            return draft
          } catch (e) {
            console.error('Failed to parse draft:', e)
            return null
          }
        }
      }
      return null
    },
    
    async saveDraft() {
      if (!this.currentDraft) return
      
      this.saveStatus = 'saving'
      
      try {
        this.currentDraft.updatedAt = new Date().toISOString()
        this.currentDraft.currentStep = this.currentStep
        this.currentDraft.syncCount = this.syncCount
        
        if (import.meta.client) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentDraft))
        }
        
        this.saveStatus = 'saved'
        
        setTimeout(() => {
          if (this.saveStatus === 'saved') {
            this.saveStatus = 'idle'
          }
        }, 2000)
      } catch (e) {
        this.saveStatus = 'error'
        console.error('Failed to save draft:', e)
      }
    },
    
    updateField(stepKey: keyof FormData, field: string, value: any) {
      if (this.currentDraft) {
        (this.currentDraft.data[stepKey] as any)[field] = value
        this.debouncedSave()
      }
    },
    
    debouncedSave() {
      clearTimeout((this as any)._saveTimeout)
      ;(this as any)._saveTimeout = setTimeout(() => {
        this.saveDraft()
      }, 1500)
    },
    
    setStep(step: number) {
      this.currentStep = Math.max(1, Math.min(12, step))
      this.saveDraft()
    },
    
    nextStep() {
      if (this.currentStep < 12) {
        this.currentStep++
        this.saveDraft()
      }
    },
    
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
        this.saveDraft()
      }
    },
    
    async simulateSync(): Promise<boolean> {
      if (this.syncCount >= 3) {
        return false
      }
      
      this.syncInProgress = true
      this.syncSuccess = false
      
      // 模拟2秒的同步过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      this.syncCount++
      this.syncInProgress = false
      this.syncSuccess = true
      
      if (this.currentDraft) {
        this.currentDraft.syncCount = this.syncCount
        this.currentDraft.status = 'synced'
        this.saveDraft()
      }
      
      return true
    },
    
    resetSyncStatus() {
      this.syncSuccess = false
    },
    
    clearDraft() {
      this.currentDraft = null
      this.currentStep = 1
      this.syncCount = 0
      this.saveStatus = 'idle'
      
      if (import.meta.client) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }
})
