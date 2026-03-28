import { Table } from 'antd'
import type { ColumnType } from 'antd/es/table'
import { useState } from 'react'
import { LayoutSpinner } from '../LayoutSpinner/LayoutSpinner'
import styles from './ListTable.module.scss'
import FiltersTable from './components/FiltersTable/FiltersTable'

function ListTable<K extends { [key: string]: unknown }>({
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
      <FiltersTable<K>
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
