import { useIsMobile } from '@/hooks/useIsMobile'
import masks, { type MaskEnum } from '@/utils/masks'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { Input, Select, Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import Button from '../Button/Button'
import { LayoutSpinner } from '../LayoutSpinner/LayoutSpinner'
import MultiDatepicker from '../MultiDatepicker/MultiDatepicker'
import {
  DayjsType,
  type DateValue,
  type DayjsValue
} from '../MultiDatepicker/types'
import styles from './ListTable.module.scss'

type SearchField =
  | 'number'
  | 'cpf'
  | 'name'
  | 'email'
  | 'createdAt'
  | 'updatedAt'

interface SearchableItem {
  number?: number
  cpf?: string
  name?: string | string[]
  email?: string | string[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

type MaskMap = Record<SearchField, MaskEnum | null>

const FIELD_OPTIONS: { label: string; value: SearchField }[] = [
  { label: 'ID', value: 'number' },
  { label: 'CPF', value: 'cpf' },
  { label: 'Nome', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Criado em', value: 'createdAt' },
  { label: 'Atualizado em', value: 'updatedAt' }
]

const FIELD_MASKS: MaskMap = {
  cpf: 'cpf',
  createdAt: 'date',
  updatedAt: 'date',
  number: null,
  name: null,
  email: null
}

function ListTable<T extends SearchableItem>({
  dataSource,
  columns,
  pageSize = 6,
  loading,
  onReload
}: {
  dataSource: T[]
  columns: ColumnType<T>[]
  pageSize?: number
  loading: boolean
  onReload: () => void
}) {
  const [searchField, setSearchField] = useState<SearchField>('number')
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState<[DateValue, DateValue]>([
    null,
    null
  ])
  const isMobile = useIsMobile()

  const isDateField = searchField === 'createdAt' || searchField === 'updatedAt'

  function handleFieldChange(field: SearchField) {
    setSearchField(field)
    setSearch('')
    setDateRange([null, null])
  }

  const filteredData = useMemo(() => {
    if (isDateField) {
      const [start, end] = dateRange
      if (!start || !end) return dataSource
      return dataSource.filter((item) => {
        const itemDate = dayjs(item[searchField]).startOf('day').valueOf()
        const startTs = start.startOf('day').valueOf()
        const endTs = end.endOf('day').valueOf()
        return itemDate >= startTs && itemDate <= endTs
      })
    }

    if (!search.trim()) return dataSource
    const isMasked = !!FIELD_MASKS[searchField]
    const searchTerm = isMasked
      ? search.replace(/\D/g, '').toLowerCase()
      : search.toLowerCase()
    return dataSource.filter((item) => {
      const raw = String(item[searchField] ?? '')
      const itemValue = isMasked
        ? raw.replace(/\D/g, '').toLowerCase()
        : raw.toLowerCase()
      return itemValue.includes(searchTerm)
    })
  }, [dataSource, search, searchField, isDateField, dateRange])

  const currentFieldLabel =
    FIELD_OPTIONS.find((f) => f.value === searchField)?.label ?? ''

  if (loading) {
    return <LayoutSpinner />
  }

  return (
    <>
      <div className={styles.filters}>
        <div className={styles.filtersGroup}>
          <Select
            className={styles.filterSelect}
            rootClassName={styles.filterSelectDropdown}
            value={searchField}
            onChange={handleFieldChange}
            options={FIELD_OPTIONS}
          />

          {isDateField ? (
            <MultiDatepicker
              className={styles.filterDateRange}
              value={dateRange}
              type={DayjsType.range}
              options={[DayjsType.range]}
              onDateChange={(dates: DayjsValue) => {
                if (dates && Array.isArray(dates)) {
                  setDateRange([dates[0], dates[1]])
                } else {
                  setDateRange([null, null])
                }
              }}
              allowClear
            />
          ) : (
            <Input
              className={styles.searchInput}
              placeholder={`Pesquisar por ${currentFieldLabel}`}
              allowClear
              value={search}
              onChange={(e) => {
                const mask = FIELD_MASKS[searchField]
                setSearch(mask ? masks(e.target.value, mask) : e.target.value)
              }}
            />
          )}
        </div>

        {isMobile ? (
          <Button className='w-100' buttonHeight='2rem' onClick={onReload}>
            Atualizar
          </Button>
        ) : (
          <Button mode='icon' onClick={onReload}>
            <ArrowCounterClockwiseIcon />
          </Button>
        )}
      </div>

      <div className={styles.tableWrapper}>
        <Table
          className={styles.listTable}
          rowKey='_id'
          dataSource={filteredData}
          columns={columns}
          tableLayout='fixed'
          loading={loading}
          pagination={{ pageSize, hideOnSinglePage: true }}
          size='middle'
          bordered={false}
          scroll={{ x: '100%' }}
        />
      </div>
    </>
  )
}

export default ListTable
