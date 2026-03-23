import type { MaskEnum } from '@/utils/masks'
import masks from '@/utils/masks'
import {
  Input as AntInput,
  Form,
  Skeleton,
  type FormItemProps,
  type InputProps,
  type InputRef
} from 'antd'
import { useState, type RefObject } from 'react'
import styles from '../../styles/Form.module.scss'

interface IFormItemProps extends FormItemProps {
  children: React.ReactNode
  inputHeight?: string
}

function FormItem({ inputHeight, children, ...props }: IFormItemProps) {
  return (
    <Form.Item
      className={styles.input}
      style={
        {
          '--input-height': inputHeight || '3rem'
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Form.Item>
  )
}

interface IInputProps extends InputProps {
  mask?: MaskEnum
  value?: string | number | undefined
  loading?: boolean
  inputRef?: RefObject<InputRef | null>
}

function InputText({
  mask,
  value = '',
  loading = false,
  maxLength,
  inputRef,
  ...rest
}: IInputProps) {
  const [valueMask, setValueMask] = useState(value)
  const maxLengthList: Partial<Record<MaskEnum, number>> = {
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

function InputDate({ value, onChange, ...rest }: Omit<IInputProps, 'mask'>) {
  const [valueMask, setValueMask] = useState(value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const maskedValue = masks(value, 'date')
    setValueMask(maskedValue)
    if (onChange) return onChange(event)
    return event
  }

  return (
    <AntInput
      {...rest}
      value={masks(value, 'date') || valueMask}
      onChange={handleChange}
    />
  )
}

export { FormItem, InputDate, InputText }

