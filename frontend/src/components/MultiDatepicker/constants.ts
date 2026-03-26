import type { FormatDateModes } from '@/utils/formatDate'
import { useEffect } from 'react'
import { DATE_MASKS, type MultiDatepickerType } from './types'

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

function applyDateMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, '')
  let result = ''
  let digitIndex = 0

  for (let i = 0; i < mask.length && digitIndex < digits.length; i++) {
    if (mask[i] === '/') {
      result += '/'
    } else {
      result += digits[digitIndex++]
    }
  }

  return result
}

export function useInputMask(
  pickerRef: React.RefObject<HTMLElement | null>,
  type: MultiDatepickerType
) {
  useEffect(() => {
    const maskConfig = DATE_MASKS[type]
    if (!maskConfig) return

    const container = pickerRef.current as HTMLElement
    if (!container) return

    const input = container.querySelector<HTMLInputElement>('input')
    if (!input) return

    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      const masked = applyDateMask(target.value, maskConfig.mask)

      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set

      nativeInputValueSetter?.call(target, masked)
      target.dispatchEvent(new Event('input', { bubbles: true }))
    }

    input.addEventListener('input', handleInput)
    return () => input.removeEventListener('input', handleInput)
  }, [pickerRef, type])
}
