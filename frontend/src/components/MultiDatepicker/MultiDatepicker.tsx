import { formatDate } from '@/utils/formatDate'
import { GearIcon } from '@phosphor-icons/react'
import type { DatePickerProps, MenuProps } from 'antd'
import { Button, DatePicker, Dropdown, type DropdownProps } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useRef, type JSX, type ReactNode } from 'react'
import { getMultiDatepickerFormat, useInputMask } from './constants'
import styles from './MultiDatepicker.module.scss'
import {
  DayjsType,
  INPUT_PARSE_FORMATS,
  type DateValue,
  type DayjsValue,
  type RangeValue
} from './types'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Sao_Paulo')
dayjs.locale('pt-br')

type IMultiDatepickerContainerProps = JSX.IntrinsicElements['div'] & {
  menu: DropdownProps['menu']
  children: ReactNode
  dateSelectorRef?: React.LegacyRef<HTMLButtonElement>
}

export function MultiDatepickerContainer({
  menu,
  children,
  className,
  dateSelectorRef,
  ...rest
}: IMultiDatepickerContainerProps) {
  return (
    <div
      className={`${styles['multi-datepicker']} ${className || ''}`}
      {...rest}
    >
      {menu?.items && menu?.items?.length > 1 && (
        <Dropdown
          className={styles['multi-datepicker__button']}
          getPopupContainer={() =>
            document.querySelector(`.${styles['multi-datepicker']}`) ||
            document.body
          }
          trigger={['click']}
          menu={menu}
        >
          <Button ref={dateSelectorRef}>
            <GearIcon />
          </Button>
        </Dropdown>
      )}

      {children}
    </div>
  )
}

interface IInputDate {
  type?: DayjsType
  onDateTypeChange?: (type: DayjsType) => void
  onDateChange: (value: DayjsValue) => void
  value: DayjsValue
  defaultValue?: DayjsValue
  options?: DayjsType[]
  className?: string
  style?: React.CSSProperties
  allowClear?: boolean
  defaultPickerType?: DayjsType
  dateSelectorRef?: React.RefObject<HTMLButtonElement>
}

export default function MultiDatepicker({
  type = DayjsType.date,
  onDateTypeChange,
  onDateChange,
  value,
  defaultValue,
  defaultPickerType = DayjsType.month,
  options = Object.values(DayjsType),
  className,
  style,
  allowClear = false,
  dateSelectorRef
}: IInputDate) {
  const pickerRef = useRef<HTMLDivElement>(null)
  useInputMask(pickerRef, type)

  const getDisplayFormat = (): DatePickerProps['format'] => {
    if (type === DayjsType.week) {
      const weekFormat: DatePickerProps['format'] = [
        (value: Dayjs) =>
          `${formatDate({
            date: dayjs(value).startOf('week'),
            mode: getMultiDatepickerFormat({ type, mode: 'display' })
          })} até ${formatDate({
            date: dayjs(value).endOf('week'),
            mode: getMultiDatepickerFormat({ type, mode: 'display' })
          })}`,
        ...INPUT_PARSE_FORMATS.week
      ]
      return weekFormat
    }

    return INPUT_PARSE_FORMATS[type]
  }

  const handleSingleChange = (date: Dayjs | null) => {
    onDateChange(date)
  }

  const handleRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    onDateChange(dates)
  }

  const menuItems: MenuProps['items'] = [
    options.includes('date') && {
      key: 'date',
      label: 'Diário',
      onClick: () => onDateTypeChange?.('date')
    },
    options.includes('week') && {
      key: 'week',
      label: 'Semanal',
      onClick: () => onDateTypeChange?.('week')
    },
    options.includes('range') && {
      key: 'range',
      label: 'Intervalo',
      onClick: () => onDateTypeChange?.('range')
    },
    options.includes('month') && {
      key: 'month',
      label: 'Mensal',
      onClick: () => onDateTypeChange?.('month')
    },
    options.includes('year') && {
      key: 'year',
      label: 'Anual',
      onClick: () => onDateTypeChange?.('year')
    }
  ].filter(Boolean) as MenuProps['items']

  const commonProps = {
    className: 'w-100',
    getPopupContainer: () =>
      (document.querySelector('.dashboard__filters--date') as HTMLElement) ||
      document.body,
    allowClear,
    disabledDate: (current: Dayjs) => current.isAfter(dayjs())
  }

  return (
    <MultiDatepickerContainer
      dateSelectorRef={dateSelectorRef}
      className={className || ''}
      style={style}
      menu={{
        items: menuItems,
        selectable: true,
        defaultSelectedKeys: [defaultPickerType],
        selectedKeys: [type || defaultPickerType],
        className: styles['multi-datepicker__menu']
      }}
    >
      {type === 'range' ? (
        <div ref={pickerRef} className='w-100'>
          <DatePicker.RangePicker
            {...commonProps}
            value={value as RangeValue}
            onChange={handleRangeChange}
            format={INPUT_PARSE_FORMATS.range}
          />
        </div>
      ) : (
        <div ref={pickerRef} className='w-100'>
          <DatePicker
            {...commonProps}
            picker={type}
            value={value as DateValue}
            defaultValue={defaultValue as DateValue}
            onChange={handleSingleChange}
            format={getDisplayFormat()}
            showWeek={type === 'week' ? false : undefined}
          />
        </div>
      )}
    </MultiDatepickerContainer>
  )
}
