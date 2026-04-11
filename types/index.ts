export interface DS160FormData {
  // Step 1: Personal Information
  personalInfo: {
    surname: string
    givenName: string
    fullNameInNativeAlphabet?: string
    hasOtherNames: boolean
    otherNames?: Array<{
      surname: string
      givenName: string
    }>
    dateOfBirth: string
    cityOfBirth: string
    stateOfBirth?: string
    countryOfBirth: string
    nationality: string
    hasOtherNationality: boolean
    otherNationalities?: string[]
    nationalIdNumber?: string
    usSocialSecurityNumber?: string
    usTaxpayerId?: string
  }

  // Step 2: Contact Information
  contactInfo: {
    homeAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    phoneNumber: string
    secondaryPhoneNumber?: string
    email: string
    socialMedia?: Array<{
      platform: string
      handle: string
    }>
  }

  // Step 3: Passport Information
  passportInfo: {
    passportNumber: string
    passportBookNumber?: string
    countryOfIssuance: string
    issuanceCity: string
    issuanceState?: string
    issuanceCountry: string
    issuanceDate: string
    expirationDate: string
    hasLostPassport: boolean
    lostPassportDetails?: {
      passportNumber: string
      countryOfIssuance: string
      explanation: string
    }
  }

  // Step 4: Travel Information
  travelInfo: {
    purposeOfTrip: string
    otherPurposeExplanation?: string
    specificTravel?: {
      arrivalDate: string
      departureDate?: string
      addressInUS: {
        street: string
        city: string
        state: string
        zipCode: string
      }
      contactPersonInUS?: {
        name: string
        relationship: string
        address: string
        phone: string
      }
    }
    whoIsPaying: string
    hasOtherPersonPaying: boolean
    payerDetails?: {
      surname: string
      givenName: string
      phone: string
      email: string
      relationship: string
      address: string
    }
  }

  // Step 5: Travel Companions
  travelCompanions: {
    hasTravelCompanions: boolean
    companions?: Array<{
      surname: string
      givenName: string
      relationship: string
    }>
    isPartOfGroup: boolean
    groupName?: string
  }

  // Step 6: Previous US Travel
  previousUSTravel: {
    hasBeenToUS: boolean
    previousTrips?: Array<{
      arrivalDate: string
      lengthOfStay: string
    }>
    hasBeenIssuedUSVisa: boolean
    previousVisas?: Array<{
      visaNumber?: string
      issueDate: string
      annotation?: string
    }>
    hasBeenRefusedUSVisa: boolean
    refusalExplanation?: string
    hasBeenRefusedUSEntry: boolean
    entryRefusalExplanation?: string
    hasHadVisaCancelled: boolean
    cancellationExplanation?: string
  }

  // Step 7: Family Information
  familyInfo: {
    fatherInfo: {
      surname: string
      givenName: string
      dateOfBirth: string
      isInUS: boolean
      usStatus?: string
    }
    motherInfo: {
      surname: string
      givenName: string
      dateOfBirth: string
      isInUS: boolean
      usStatus?: string
    }
    hasImmediateRelativesInUS: boolean
    relativesInUS?: Array<{
      surname: string
      givenName: string
      relationship: string
      usStatus: string
    }>
    maritalStatus: string
    spouseInfo?: {
      surname: string
      givenName: string
      dateOfBirth: string
      nationality: string
      cityOfBirth: string
      countryOfBirth: string
      addressType: string
      address?: string
    }
  }

  // Step 8: Work/Education/Training
  workEducation: {
    primaryOccupation: string
    otherOccupationExplanation?: string
    employerOrSchool?: {
      name: string
      address: {
        street: string
        city: string
        state?: string
        zipCode?: string
        country: string
      }
      phone: string
      startDate: string
      monthlyIncome?: number
      duties?: string
    }
    previousEmployment?: Array<{
      employer: string
      address: string
      jobTitle: string
      supervisor: string
      startDate: string
      endDate: string
      duties: string
    }>
    hasAdditionalWorkEducation: boolean
    educationLevel: string
    schools?: Array<{
      name: string
      address: string
      courseOfStudy: string
      startDate: string
      endDate: string
    }>
  }

  // Step 9: Security Questions Part 1
  securityQuestions1: {
    hasCommunicableDisease: boolean
    hasMentalDisorder: boolean
    isDrugAbuser: boolean
    hasArrestRecord: boolean
    arrestRecordExplanation?: string
    hasViolatedControlledSubstanceLaw: boolean
    isEngagedInProstitution: boolean
    hasEngagedInMoneyLaundering: boolean
    hasEngagedInHumanTrafficking: boolean
    hasAssistedInHumanTrafficking: boolean
    isRelatedToHumanTrafficker: boolean
  }

  // Step 10: Security Questions Part 2
  securityQuestions2: {
    hasSoughtImmunity: boolean
    hasWithheldChildCustody: boolean
    hasVotedUnlawfully: boolean
    hasRenouncedCitizenshipForTax: boolean
    hasBeenRemoved: boolean
    hasViolatedImmigrationLaw: boolean
    hasCausedImmigrationViolation: boolean
    hasAssertedFalseClaim: boolean
    hasFraudulentlyObtainedBenefit: boolean
    isSubjectToCivilPenalty: boolean
    hasCausedSeriousHarm: boolean
    isChildAbductor: boolean
  }

  // Step 11: Additional Travel Information
  additionalTravel: {
    countriesVisitedLast5Years?: Array<{
      country: string
      year: string
    }>
    hasSpecializedSkills: boolean
    specializedSkills?: Array<{
      skill: string
      details: string
    }>
    hasServedInMilitary: boolean
    militaryService?: Array<{
      country: string
      branch: string
      rank: string
      specialty: string
      startDate: string
      endDate: string
    }>
    hasParticipatedInParamilitary: boolean
    hasWorkedForIntelligence: boolean
  }

  // Step 12: Photo Confirmation
  photoConfirmation: {
    photoUploaded: boolean
    photoMeetsRequirements: boolean
    confirmationDate?: string
  }
}

export interface DraftMeta {
  id: string
  createdAt: string
  updatedAt: string
  currentStep: number
  completionPercentage: number
  syncStatus: 'local' | 'synced' | 'syncing' | 'error'
  syncCount: number
  lastSyncAt?: string
}

export interface HighRiskField {
  field: string
  reason: string
  tips: string[]
}
