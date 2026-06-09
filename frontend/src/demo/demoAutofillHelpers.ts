import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import type { IDiseaseOption } from '@/interfaces/ISymptomDiseases'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export function parseDemoDate(value: string) {
  const parsed = dayjs(value, 'DD/MM/YYYY', true)
  return parsed.isValid() ? parsed : dayjs(value)
}

export function findUnitOptionId(
  options: { label: string; value: string }[],
  unitName: string
): string | undefined {
  const normalized = unitName.trim().toLowerCase()
  const match = options.find(
    (opt) => opt.label.trim().toLowerCase() === normalized
  )
  return match?.value
}

export function resolveSymptomKeysByLabels(
  labels: string[],
  options: ISymptomOption[]
): string[] {
  const keys = new Set<string>()
  for (const label of labels) {
    const token = label.trim().toLowerCase()
    const byLabel = options.find(
      (opt) => opt.label.trim().toLowerCase() === token
    )
    const byKey = options.find((opt) => opt.key.trim().toLowerCase() === token)
    if (byLabel) keys.add(byLabel.key)
    else if (byKey) keys.add(byKey.key)
  }
  return [...keys]
}

export function pickDiagnosisKey(
  options: IDiseaseOption[],
  hints: string[]
): string | undefined {
  for (const hint of hints) {
    const token = hint.trim().toLowerCase()
    const match = options.find(
      (opt) =>
        opt.label.toLowerCase().includes(token) ||
        opt.key.toLowerCase().includes(token)
    )
    if (match) return match.key
  }
  return options[0]?.key
}
