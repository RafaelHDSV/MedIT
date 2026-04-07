import masks, { type MaskEnum } from '@/utils/masks'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { DatePicker, Input, Select, Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import Button from '../Button/Button'
import { LayoutSpinner } from '../LayoutSpinner/LayoutSpinner'
import type { DateValue } from '../MultiDatepicker/types'
import styles from './ListTable.module.scss'

type SearchField = 'number' | 'cpf' | 'name' | 'email' | 'birthDate'

interface SearchableItem {
  number?: string
  cpf?: string
  name?: string | string[]
  email?: string | string[]
  birthDate?: Date | string
}

type MaskMap = Record<SearchField, MaskEnum | null>

const FIELD_OPTIONS: { label: string; value: SearchField }[] = [
  { label: 'ID', value: 'number' },
  { label: 'CPF', value: 'cpf' },
  { label: 'Nome', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Data de Nascimento', value: 'birthDate' }
]

const FIELD_MASKS: MaskMap = {
  cpf: 'cpf',
  birthDate: 'date',
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

  const isDateField = searchField === 'birthDate'

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
        const date = dayjs(item.birthDate)
        const itemTimestamp = date.startOf('day').valueOf()
        const startTimestamp = start.startOf('day').valueOf()
        const endTimestamp = end.endOf('day').valueOf()
        return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp
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
  }, [dataSource, search, searchField, dateRange, isDateField])

  function handleReset() {
    setSearch('')
    setDateRange([null, null])
    onReload()
  }

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
            <div className={styles.dateRange}>
              <DatePicker
                className={styles.dateInput}
                rootClassName={styles.filterDatepicker}
                value={dateRange[0]}
                onChange={(date) => setDateRange([date, dateRange[1]])}
                format='DD/MM/YYYY'
                placeholder='Data inicial'
              />
              <span className={styles.dateSeparator}>—</span>
              <DatePicker
                className={styles.dateInput}
                rootClassName={styles.filterDatepicker}
                value={dateRange[1]}
                onChange={(date) => setDateRange([dateRange[0], date])}
                format='DD/MM/YYYY'
                placeholder='Data final'
              />
            </div>
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

        <Button mode='icon' onClick={handleReset}>
          <ArrowCounterClockwiseIcon />
        </Button>
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
