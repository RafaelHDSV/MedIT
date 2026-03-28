import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { DatePicker, Flex, Input, Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import Button from '../Button/Button'
import { LayoutSpinner } from '../LayoutSpinner/LayoutSpinner'
import styles from './ListTable.module.scss'

interface IFiltersProps<K> {
  dataSource: K[]
  onReload: () => void
  setFiltersKey: (key: string) => void
  setFilteredDataSource: (data: K[]) => void
}

function Filters<K>({
  dataSource,
  onReload,
  setFiltersKey,
  setFilteredDataSource
}: IFiltersProps<K>) {
  const [searchText, setSearchText] = useState('')
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null)

  const filtersKey = useMemo(() => {
    return JSON.stringify({
      searchText: searchText.trim().toLowerCase(),
      birthDate: birthDate ? birthDate.format('YYYY-MM-DD') : null
    })
  }, [birthDate, searchText])

  const filteredDataSource = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return dataSource.filter((record) => {
      const recordAny = record as Record<string, unknown>

      if (normalizedSearch) {
        const name = String(recordAny?.name ?? '').toLowerCase()
        const email = String(recordAny?.email ?? '').toLowerCase()
        const cpf = String(recordAny?.cpf ?? '').toLowerCase()

        const matchesSearch =
          name.includes(normalizedSearch) ||
          email.includes(normalizedSearch) ||
          cpf.includes(normalizedSearch)

        if (!matchesSearch) return false
      }

      if (birthDate) {
        const recordBirthDate = recordAny.birthDate as Date | string | undefined
        const recordDay = recordBirthDate ? dayjs(recordBirthDate) : null

        if (!recordDay || !recordDay.isValid()) return false
        if (!recordDay.isSame(birthDate, 'day')) return false
      }

      return true
    })
  }, [birthDate, dataSource, searchText])

  useEffect(() => {
    setFiltersKey(filtersKey)
    setFilteredDataSource(filteredDataSource)
  }, [filtersKey, filteredDataSource, setFiltersKey, setFilteredDataSource])

  return (
    <Flex gap={16} align='center' className={styles.filters} wrap>
      <Input
        placeholder='Pesquisar por nome, email ou CPF'
        allowClear
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 260 }}
      />

      <DatePicker
        placeholder='Data de nascimento'
        allowClear
        value={birthDate}
        onChange={(value) => setBirthDate(value)}
      />

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

function ListTable<K extends object>({
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
  const [filtersKey, setFiltersKey] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState<K[]>(dataSource)

  if (loading) {
    return <LayoutSpinner />
  }

  return (
    <>
      <Filters<K>
        dataSource={dataSource}
        onReload={onReload}
        setFiltersKey={setFiltersKey}
        setFilteredDataSource={setFilteredDataSource}
      />

      <div className={styles.tableWrapper}>
        <Table<K>
          key={filtersKey}
          className={styles.userTable}
          rowKey='_id'
          dataSource={filteredDataSource}
          columns={columns}
          tableLayout='fixed'
          loading={loading}
          pagination={{
            pageSize,
            hideOnSinglePage: true
          }}
          size='middle'
          bordered={false}
          scroll={{ x: 'min-content' }}
        />
      </div>
    </>
  )
}

export default ListTable
