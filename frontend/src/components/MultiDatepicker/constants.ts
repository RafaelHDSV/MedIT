import type { FormatDateModes } from '@/utils/formatDate'
import type { MultiDatepickerType } from './types'

interface IMultiDatepickerFormatProps {
  type: MultiDatepickerType
  mode: 'display' | 'store'
}

export function getMultiDatepickerFormat({
  type,
  mode
}: IMultiDatepickerFormatProps) {
  const modes: { display: FormatDateModes; store: FormatDateModes } = {
    display: (() => {
      switch (type) {
        case 'month':
          return 'displayMonth'
        case 'date':
        case 'range':
          return 'date'
        case 'year':
          return 'displayYear'
        case 'week':
          return 'displayWeek'
      }
    })(),
    store: (() => {
      switch (type) {
        case 'month':
          return 'serverMonth'
        case 'date':
        case 'range':
          return 'serverCompleteDate'
        case 'year':
          return 'serverYear'
        case 'week':
          return 'date'
      }
    })()
  }
  return modes[mode]
}
