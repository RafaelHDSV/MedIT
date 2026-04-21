import { Periods } from '@/interfaces/globals'
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
import MultiDatepicker from '../MultiDatepicker/MultiDatepicker'
import {
  DayjsType,
  type DateValue,
  type DayjsValue,
  type RangeValue
} from '../MultiDatepicker/types'
import type { Dayjs } from 'dayjs'
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

function InputSelect({ className, inputHeight, ...rest }: IInputSelectProps) {
  return (
    <Select
      className={`${styles.select} ${className || ''}`}
      style={{ '--input-height': inputHeight || '3rem' } as React.CSSProperties}
      {...rest}
    />
  )
}

interface IInputDateProps {
  value?: string
  inputHeight?: string
  dateType?: DayjsType
  onChange?: (date: DayjsValue) => void
}

function periodToDayjsType(period: Periods): DayjsType {
  switch (period) {
    case Periods.DAY:
      return DayjsType.date
    case Periods.WEEK:
      return DayjsType.week
    case Periods.MONTH:
      return DayjsType.month
    case Periods.YEAR:
      return DayjsType.year
    default:
      return DayjsType.date
  }
}

interface IInputDashboardPeriodDateProps {
  period: Periods
  value: Dayjs
  onChange: (value: Dayjs) => void
  inputHeight?: string
  className?: string
}

function InputDashboardPeriodDate({
  period,
  value,
  onChange,
  inputHeight = '2rem',
  className
}: IInputDashboardPeriodDateProps) {
  const pickerType = periodToDayjsType(period)

  return (
    <MultiDatepicker
      key={period}
      className={`${styles.multiDatepicker} ${className ?? ''}`}
      style={{ '--input-height': inputHeight } as React.CSSProperties}
      type={pickerType}
      defaultPickerType={pickerType}
      options={[pickerType]}
      value={value as DateValue}
      onDateChange={(date: DayjsValue) => {
        if (!date || Array.isArray(date)) return
        onChange(date)
      }}
    />
  )
}

function InputDate({
  value: initialValue,
  inputHeight = '3rem',
  dateType,
  onChange
}: IInputDateProps) {
  const [value, setValue] = useState<DayjsValue>(null)
  const [type, setType] = useState<DayjsType>(dateType || DayjsType.date)

  const handleDateTypeChange = (type: DayjsType) => {
    setType(type)
  }

  const finalValue = () => {
    if (initialValue !== undefined) return dayjs(initialValue) as DayjsValue

    switch (type) {
      case DayjsType.range:
        return value as RangeValue
      case DayjsType.date:
        return value as DateValue
      default:
        return value as DayjsValue
    }
  }

  return (
    <MultiDatepicker
      className={styles.multiDatepicker}
      style={{ '--input-height': inputHeight } as React.CSSProperties}
      type={type}
      defaultPickerType={type}
      options={[type]}
      onDateTypeChange={handleDateTypeChange}
      value={finalValue()}
      defaultValue={dayjs()}
      onDateChange={(date: DayjsValue) => {
        if (!date) return
        setValue(date)
        onChange?.(date)
      }}
    />
  )
}

export { FormItem, InputDashboardPeriodDate, InputDate, InputSelect, InputText }
