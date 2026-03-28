import Button from '@/components/Button/Button'
import {
  FormItem,
  InputDate,
  InputText
} from '@/components/FormComponents/FormComponents'
import { DateType } from '@/components/MultiDatepicker/MultiDatepicker'
import masks from '@/utils/masks'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { Flex } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import styles from './FiltersTable.module.scss'

interface IFiltersProps<K extends { [key: string]: unknown }> {
  dataSource: K[]
  onReload: () => void
  setFiltersKey: (key: string) => void
  setFilteredDataSource: (data: K[]) => void
  searchableFields?: (keyof K)[]
}

const INPUT_HEIGHT = '3rem'

type DateRange = [Dayjs | null, Dayjs | null] | null

function FiltersTable<K extends { [key: string]: unknown }>({
  dataSource,
  onReload,
  setFiltersKey,
  setFilteredDataSource,
  searchableFields = ['name', 'email', 'cpf'] as (keyof K)[]
}: IFiltersProps<K>) {
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState<DateRange>(null)

  function useDebounce<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay)
      return () => clearTimeout(timer)
    }, [value, delay])

    return debounced
  }

  const debouncedSearch = useDebounce(searchText, 300)

  const filtersKey = useMemo(() => {
    return JSON.stringify({
      search: debouncedSearch,
      dateRange: dateRange
        ? dateRange.map((d) => d?.format('YYYY-MM-DD'))
        : null
    })
  }, [debouncedSearch, dateRange])

  const filteredDataSource = useMemo(() => {
    const normalizedSearch = masks(debouncedSearch.trim(), 'normalize')

    return dataSource.filter((record) => {
      if (normalizedSearch) {
        const matches = searchableFields.some((field) => {
          const value = record[field]

          if (!value) return false

          return masks(String(value), 'normalize').includes(normalizedSearch)
        })

        if (!matches) return false
      }

      if (dateRange && (dateRange[0] || dateRange[1])) {
        const [start, end] = dateRange

        const recordDate =
          record.createdAt &&
          (typeof record.createdAt === 'string' ||
            typeof record.createdAt === 'number' ||
            record.createdAt instanceof Date ||
            dayjs.isDayjs(record.createdAt))
            ? dayjs(record.createdAt)
            : null

        if (!recordDate || !recordDate.isValid()) return false

        if (start && recordDate.isBefore(start, 'day')) return false
        if (end && recordDate.isAfter(end, 'day')) return false
      }

      return true
    })
  }, [dataSource, debouncedSearch, dateRange, searchableFields])

  useEffect(() => {
    setFiltersKey(filtersKey)
    setFilteredDataSource(filteredDataSource)
  }, [filtersKey, filteredDataSource, setFiltersKey, setFilteredDataSource])

  return (
    <Flex gap={16} align='center' className={styles.filters} wrap>
      <FormItem className='w-100' inputHeight={INPUT_HEIGHT}>
        <InputText
          height={INPUT_HEIGHT}
          placeholder='Pesquisar por nome, email ou CPF'
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </FormItem>

      <FormItem className='w-100' inputHeight={INPUT_HEIGHT}>
        <InputDate
          inputHeight={INPUT_HEIGHT}
          value={dateRange}
          filterType={DateType.range}
          onChange={(value) => setDateRange(value as DateRange)}
        />
      </FormItem>

      <Button
        mode='icon'
        size='large'
        onClick={onReload}
        aria-label='Recarregar'
      >
        <ArrowCounterClockwiseIcon size={24} />
      </Button>
    </Flex>
  )
}

export default FiltersTable
