import { Dayjs } from 'dayjs'

export type DateValue = Dayjs | null
export type RangeValue = [DateValue, DateValue] | null
export type DayjsValue = DateValue | RangeValue

export const DayjsType = {
  date: 'date',
  week: 'week',
  month: 'month',
  year: 'year',
  range: 'range'
} as const
export type DayjsType = (typeof DayjsType)[keyof typeof DayjsType]

export const INPUT_PARSE_FORMATS: Record<DayjsType, string[]> = {
  [DayjsType.date]: ['DD/MM/YYYY', 'D/M/YYYY', 'DDMMYYYY'],
  [DayjsType.week]: ['DD/MM/YYYY', 'D/M/YYYY'],
  [DayjsType.month]: ['MM/YYYY', 'MMYYYY'],
  [DayjsType.year]: ['YYYY'],
  [DayjsType.range]: ['DD/MM/YYYY', 'D/M/YYYY', 'DDMMYYYY']
}

export const DATE_MASKS: Record<
  DayjsType,
  { mask: string; placeholder: string }
> = {
  [DayjsType.date]: { mask: 'DD/MM/YYYY', placeholder: 'DD/MM/YYYY' },
  [DayjsType.week]: { mask: 'DD/MM/YYYY', placeholder: 'DD/MM/YYYY' },
  [DayjsType.range]: { mask: 'DD/MM/YYYY', placeholder: 'DD/MM/YYYY' },
  [DayjsType.month]: { mask: 'MM/YYYY', placeholder: 'MM/YYYY' },
  [DayjsType.year]: { mask: 'YYYY', placeholder: 'YYYY' }
}
