import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'

function buildSymptomLabelMap(
  options: ISymptomOption[]
): Record<string, string> {
  return Object.fromEntries(options.map((o) => [o.key, o.label]))
}

export default buildSymptomLabelMap
