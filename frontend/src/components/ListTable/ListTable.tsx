import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { DatePicker, Flex, Input, Select, Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import Button from '../Button/Button'
import { LayoutSpinner } from '../LayoutSpinner/LayoutSpinner'
import styles from './ListTable.module.scss'

type SearchField = 'name' | 'email' | 'cpf' | 'crm' | 'number' | 'birthDate'

const FIELD_OPTIONS: { label: string; value: SearchField }[] = [
  { label: 'Nome', value: 'name' },
  { label: 'Email', value: 'email' },
  { label: 'CPF', value: 'cpf' },
  { label: 'CRM', value: 'crm' },
  { label: 'ID', value: 'number' },
  { label: 'Data de Nascimento', value: 'birthDate' },
]

function ListTable<K extends Record<string, any>>({
  dataSource,
  columns,
  pageSize = 6,
  loading,
  onReload
}: {
  dataSource: K[]
  columns: ColumnType<K>[]
  pageSize?: number
  loading: boolean
  onReload: () => void
}) {
  const [searchField, setSearchField] = useState<SearchField>('name')
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null])

  const isDateField = searchField === 'birthDate'

  function handleReset() {
    setSearch('')
    setDateRange([null, null])
    onReload()
  }

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
        return date.isAfter(start.startOf('day')) && date.isBefore(end.endOf('day'))
      })
    }

    if (!search.trim()) return dataSource
    const term = search.toLowerCase()
    return dataSource.filter((item) =>
      String(item[searchField] ?? '').toLowerCase().includes(term)
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
          style={{ width: 200 }}
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
            placeholder={`Pesquisar por ${FIELD_OPTIONS.find(f => f.value === searchField)?.label}`}
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1 }}
          />
        )}

        <Button mode='icon' onClick={handleReset}>
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