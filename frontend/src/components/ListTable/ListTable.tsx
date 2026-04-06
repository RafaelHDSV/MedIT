import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { Flex, Input, Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import Button from '../Button/Button'
import { LayoutSpinner } from '../LayoutSpinner/LayoutSpinner'
import styles from './ListTable.module.scss'

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
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    if (!search.trim()) return dataSource
    const term = search.toLowerCase()
    return dataSource.filter((item) =>
      ['name', 'email', 'cpf', 'crm'].some((field) =>
        String(item[field] ?? '').toLowerCase().includes(term)
      )
    )
  }, [dataSource, search])

  if (loading) {
    return <LayoutSpinner />
  }

  return (
    <>
      <Flex gap={16} align='center' className={styles.filters}>
        <Input
          placeholder='Pesquisar por nome, email, CPF ou CRM'
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button mode='icon' onClick={() => { setSearch(''); onReload() }}>
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