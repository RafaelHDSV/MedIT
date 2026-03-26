export type MultiDatepickerType = 'month' | 'date' | 'year' | 'range' | 'week'

export const DEFAULT_DATE_TYPE_OPTIONS: MultiDatepickerType[] = [
  'month',
  'date',
  'year',
  'range',
  'week'
]

export const INPUT_PARSE_FORMATS: Record<MultiDatepickerType, string[]> = {
  date: ['DD/MM/YYYY', 'D/M/YYYY', 'DDMMYYYY'],
  week: ['DD/MM/YYYY', 'D/M/YYYY'],
  month: ['MM/YYYY', 'MMYYYY'],
  year: ['YYYY'],
  range: ['DD/MM/YYYY', 'D/M/YYYY', 'DDMMYYYY']
}

export const DATE_MASKS: Record<string, { mask: string; placeholder: string }> =
  {
    date: { mask: 'DD/MM/YYYY', placeholder: 'DD/MM/YYYY' },
    week: { mask: 'DD/MM/YYYY', placeholder: 'DD/MM/YYYY' },
    range: { mask: 'DD/MM/YYYY', placeholder: 'DD/MM/YYYY' },
    month: { mask: 'MM/YYYY', placeholder: 'MM/YYYY' },
    year: { mask: 'YYYY', placeholder: 'YYYY' }
  }
