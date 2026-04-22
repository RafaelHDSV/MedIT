import {
  DISEASE_KEY_SET,
  DiseaseSymptomKey,
  EXACT_UI_LABEL_TO_DISEASE_KEY,
  PT_LOWER_TO_DISEASE_KEY
} from '../interfaces/ISymptomsDiseases.js'

export function getReportedSymptomsToDiseaseKeys(
  input: string[]
): DiseaseSymptomKey[] {
  const out = new Set<DiseaseSymptomKey>()

  for (const raw of input) {
    const t = typeof raw === 'string' ? raw.trim() : ''
    if (!t) continue

    const exact = EXACT_UI_LABEL_TO_DISEASE_KEY[t]
    if (exact) {
      out.add(exact)
      continue
    }

    const lower = t.toLowerCase()
    const fromLower = PT_LOWER_TO_DISEASE_KEY[lower]
    if (fromLower) {
      out.add(fromLower)
      continue
    }

    if (DISEASE_KEY_SET.has(t)) {
      out.add(t as DiseaseSymptomKey)
    }
  }

  return [...out]
}
