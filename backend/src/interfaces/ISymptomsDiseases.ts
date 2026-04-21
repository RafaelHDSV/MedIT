import { IBaseInterface } from './IBaseInterface.js'

export interface ISymptomsDiseases extends IBaseInterface {
  disease: string
  symptoms: Record<string, number>
}

export interface ISymptomOption {
  key: string
  label: string
}

export interface ISuggestedDiseases {
  disease: string
  compatibility: number
}

export interface ISuggestedDiseasesPayload {
  suggestions: ISuggestedDiseases[]
  normalizedSymptomKeys: string[]
  reportedSymptoms: string[]
}

export interface ISuggestionDetails extends ISuggestedDiseases {
  reportedSymptomKeys: string[]
  referenceSymptomKeys: string[]
  matchedReferenceCount: number
  referenceSymptomCount: number
}