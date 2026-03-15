import type { _maskEnum } from '@/utils/masks'
import masks from '@/utils/masks'
import {
  Input as AntInput,
  Skeleton,
  type InputProps,
  type InputRef
} from 'antd'
import { useState, type RefObject } from 'react'

interface IInputProps extends InputProps {
  mask?: _maskEnum
  value?: string | number | undefined
  loading?: boolean
  inputRef?: RefObject<InputRef | null>
}

export default function InputText({
  mask,
  value = '',
  loading = false,
  maxLength,
  inputRef,
  ...rest
}: IInputProps) {
  const [valueMask, setValueMask] = useState(value)
  const maxLengthList: Partial<Record<_maskEnum, number>> = {
    cpf: 14
  }

  return loading ? (
    <Skeleton />
  ) : (
    <AntInput
      {...rest}
      ref={inputRef}
      maxLength={maxLength ?? (mask ? maxLengthList[mask] : undefined)}
      value={masks(value, mask) || valueMask}
      onChange={(event) => {
        setValueMask(masks(event.target.value, mask))
        if (rest.onChange) return rest.onChange(event)
        return event
      }}
    />
  )
}
