import type {
  DiseaseSymptomKey,
  ISuggestedDiseases,
  ISuggestionDetails,
  ISymptomsDiseases
} from '../interfaces/ISymptomsDiseases.js'
import SymptomsDiseasesModel from '../models/SymptomsDiseasesModel.js'
import { getReportedSymptomsToDiseaseKeys } from '../utils/getReportedSymptomsToDiseaseKeys.js'

export function diseaseSymptomsToRecord(
  symptoms: ISymptomsDiseases['symptoms']
): ISymptomsDiseases['symptoms'] {
  if (!symptoms) return {}
  if (symptoms instanceof Map) return Object.fromEntries(symptoms.entries())
  return symptoms
}

function scoreDisease(
  diseaseRow: ISymptomsDiseases,
  patientKeys: Set<DiseaseSymptomKey>
): number {
  const profile = diseaseSymptomsToRecord(diseaseRow.symptoms)

  let totalWeight = 0
  let matchedWeight = 0

  for (const [key, weight] of Object.entries(profile)) {
    const w = Number(weight) || 0
    if (w <= 0) continue
    totalWeight += w
    if (patientKeys.has(key as DiseaseSymptomKey)) {
      matchedWeight += w
    }
  }

  if (totalWeight <= 0) return 0
  return Math.round((100 * matchedWeight) / totalWeight)
}

export async function suggestDiseasesFromReportedSymptoms(
  reported: string[],
  options?: { limit?: number; minCompatibility?: number }
): Promise<ISuggestedDiseases[]> {
  const limit = options?.limit ?? 15
  const minCompatibility = options?.minCompatibility ?? 1

  const patientKeys = new Set(getReportedSymptomsToDiseaseKeys(reported))
  if (patientKeys.size === 0) return []

  const rows = await SymptomsDiseasesModel.find().lean<ISymptomsDiseases[]>()

  const scored: ISuggestedDiseases[] = rows
    .map((row) => ({
      disease: row.disease,
      compatibility: scoreDisease(row, patientKeys)
    }))
    .filter((s) => s.compatibility >= minCompatibility)
    .sort((a, b) => {
      if (b.compatibility !== a.compatibility) {
        return b.compatibility - a.compatibility
      }
      
      return a.disease.localeCompare(b.disease, 'pt')
    })
    .slice(0, limit)

  return scored
}

export function computeSuggestionDetailForDisease(
  diseaseRow: ISymptomsDiseases,
  reported: string[]
): ISuggestionDetails {
  const patientKeys = new Set(getReportedSymptomsToDiseaseKeys(reported))
  const profile = diseaseSymptomsToRecord(diseaseRow.symptoms)
  const referenceSymptomKeys = Object.entries(profile)
    .filter(([, w]) => Number(w) > 0)
    .map(([k]) => k)
    .sort((a, b) => a.localeCompare(b))

  let matchedReferenceCount = 0
  for (const k of referenceSymptomKeys) {
    if (patientKeys.has(k as DiseaseSymptomKey)) matchedReferenceCount++
  }

  const medications = Array.isArray(diseaseRow.medications)
    ? diseaseRow.medications
    : []
  const exams = Array.isArray(diseaseRow.exams) ? diseaseRow.exams : []

  return {
    disease: diseaseRow.disease,
    compatibility: scoreDisease(diseaseRow, patientKeys),
    reportedSymptomKeys: [...getReportedSymptomsToDiseaseKeys(reported)],
    referenceSymptomKeys,
    matchedReferenceCount,
    referenceSymptomCount: referenceSymptomKeys.length,
    medications,
    exams
  }
}
