import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { DatePicker, Flex, Input, Select, Table } from 'antd'
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

const FIELD_OPTIONS: { label: string; value: SearchField }[] = [
  { label: 'ID', value: 'number' },
  { label: 'CPF', value: 'cpf' },
  { label: 'Nome', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'Data de Nascimento', value: 'birthDate' }
]

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
    const term = search.toLowerCase()
    return dataSource.filter((item) =>
      String(item[searchField] ?? '')
        .toLowerCase()
        .includes(term)
    )
  }, [dataSource, search, searchField, dateRange, isDateField])

  if (loading) {
    return <LayoutSpinner />
  }

  return (
    <>
      <Flex gap={16} align='center' className={styles.filters}>
        <Select
          value={searchField}
          onChange={handleFieldChange}
          options={FIELD_OPTIONS}
          style={{ flex: 1 }}
        />

        {isDateField ? (
          <Flex gap={8} style={{ flex: 1 }}>
            <DatePicker
              value={dateRange[0]}
              onChange={(date) => setDateRange([date, dateRange[1]])}
              format='DD/MM/YYYY'
              placeholder='Data inicial'
              style={{ flex: 1 }}
            />
            <DatePicker
              value={dateRange[1]}
              onChange={(date) => setDateRange([dateRange[0], date])}
              format='DD/MM/YYYY'
              placeholder='Data final'
              style={{ flex: 1 }}
            />
          </Flex>
        ) : (
          <Input
            placeholder={`Pesquisar por ${FIELD_OPTIONS.find((f) => f.value === searchField)?.label}`}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
        )}

        <Button mode='icon' onClick={onReload}>
          <ArrowCounterClockwiseIcon />
        </Button>
      </Flex>

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
