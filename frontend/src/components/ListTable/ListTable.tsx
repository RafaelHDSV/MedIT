import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { Flex, Input, Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import Button from '../Button/Button'
import { LayoutSpinner } from '../LayoutSpinner/LayoutSpinner'
import styles from './ListTable.module.scss'

interface IFiltersProps {
  onReload: () => void
}

function Filters({ onReload }: IFiltersProps) {
  return (
    <Flex gap={16} align='center' className={styles.filters}>
      <Input placeholder='Pesquisar por nome ou email' allowClear />
      <Button mode='icon' onClick={onReload}>
        <ArrowCounterClockwiseIcon />
      </Button>
    </Flex>
  )
}

function ListTable<K>({
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
  if (loading) {
    return <LayoutSpinner />
  }

  return (
    <>
      <Filters onReload={onReload} />

      <div className={styles.tableWrapper}>
        <Table
          className={styles.listTable}
          rowKey='_id'
          dataSource={dataSource}
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
