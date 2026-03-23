import type { MaskEnum } from '@/utils/masks'
import masks from '@/utils/masks'
import {
  Input as AntInput,
  Form,
  Select,
  Skeleton,
  type FormItemProps,
  type InputProps,
  type InputRef,
  type SelectProps
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useState, type RefObject } from 'react'
import MultiDatepicker from '../MultiDatepicker/MultiDatepicker'
import styles from './FormComponents.module.scss'

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

interface IInputSelectProps extends SelectProps {
  inputHeight?: string
}

function InputSelect({ inputHeight, ...rest }: IInputSelectProps) {
  return (
    <Select
      className={styles.select}
      style={{ '--input-height': inputHeight || '3rem' } as React.CSSProperties}
      {...rest}
    />
  )
}

interface IInputDateProps {
  inputHeight?: string
  onChange?: (date: Dayjs | [Dayjs | null, Dayjs | null] | null) => void
}

function InputDate({ inputHeight, onChange }: IInputDateProps) {
  const [value, setValue] = useState<
    Dayjs | [Dayjs | null, Dayjs | null] | null
  >(null)
  const [filterDateType, setFilterDateType] = useState<
    'date' | 'week' | 'month' | 'year' | 'range'
  >('date')

  const handleDateTypeChange = (
    type: 'date' | 'week' | 'month' | 'year' | 'range'
  ) => {
    setFilterDateType(type)
  }

  return (
    <MultiDatepicker
      className={styles.multiDatepicker}
      style={{ '--input-height': inputHeight || '3rem' } as React.CSSProperties}
      type={filterDateType}
      defaultPickerType={filterDateType}
      options={['date']}
      onDateTypeChange={handleDateTypeChange}
      value={
        filterDateType === 'range'
          ? (value as [Dayjs | null, Dayjs | null] | null)
          : (value as Dayjs | null)
      }
      defaultValue={dayjs()}
      onDateChange={(date: Dayjs | [Dayjs | null, Dayjs | null] | null) => {
        if (!date) return
        setValue(date)
        if (onChange) onChange(date)
      }}
    />
  )
}

export { FormItem, InputDate, InputSelect, InputText }

