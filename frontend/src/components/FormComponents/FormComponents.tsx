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
import dayjs from 'dayjs'
import { useState, type RefObject } from 'react'
import MultiDatepicker, {
  DateType,
  type DateValue,
  type DayjsType,
  type RangeValue
} from '../MultiDatepicker/MultiDatepicker'
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
  value?: DayjsType
  inputHeight?: string
  filterType?: DateType
  onChange?: (date: DayjsType) => void
}

function InputDate({
  value: initialValue,
  inputHeight,
  filterType,
  onChange
}: IInputDateProps) {
  const [value, setValue] = useState<DayjsType>(null)
  const [filterDateType, setFilterDateType] = useState<DateType>(
    filterType || DateType.date
  )

  const handleDateTypeChange = (type: DateType) => {
    setFilterDateType(type)
  }

  const finalValue = () => {
    if (initialValue !== undefined) return initialValue

    if (filterDateType === 'range') {
      return value as RangeValue
    }

    return value as DateValue
  }

  return (
    <MultiDatepicker
      className={styles.multiDatepicker}
      style={{ '--input-height': inputHeight || '3rem' } as React.CSSProperties}
      type={filterDateType}
      defaultPickerType={filterDateType}
      options={['date']}
      onDateTypeChange={handleDateTypeChange}
      value={finalValue()}
      defaultValue={dayjs()}
      onDateChange={(date: DayjsType) => {
        if (!date) return
        setValue(date)
        onChange?.(date)
      }}
    />
  )
}

export { FormItem, InputDate, InputSelect, InputText }

