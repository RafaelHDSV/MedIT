import { DISEASES_CHIPS } from '@/interfaces/ISymptomDiseases'

export function getDiseaseDisplayLabel(diseaseKey: string): string {
  return (
    DISEASES_CHIPS.find((diseasesChip) => diseasesChip.key === diseaseKey)
      ?.label ?? diseaseKey
  )
}
