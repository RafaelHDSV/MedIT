import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IError } from '@/interfaces/IError'
import type { INurse } from '@/interfaces/IUser'
import styles from '@/styles/UserTable.module.scss'
import { Flex, message, Table } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTriagesColumns } from './hooks/useTriagesColumns'

function Triages() {
  const columns = useTriagesColumns()
  const [loading, setLoading] = useState(false)

  const data = [
    {
      number: '1',
      name: 'John Brown',
      idade: '60',
      queixa: 'Náusea',
      data: '20/08/2004 as 15:00',
      risco: 'Alto',
    },
    {
      number: '2',
      name: 'Jim Green',
      idade: '19',
      queixa: 'Náusea',
      data: '20/08/2004 as 15:00',
      risco: 'Baixo',
    },
    {
      number: '3',
      name: 'Joe Black',
      idade: '23',
      queixa: 'Náusea',
      data: '20/08/2004 as 15:00',
      risco: 'Baixo',
    },
    {
      number: '4',
      name: 'Jim Red',
      idade: '65',
      queixa: 'Náusea',
      data: '20/08/2004 as 15:00',
      risco: 'Alto',
    },
    {
      number: '5',
      name: 'Jake White',
      idade: '43',
      queixa: 'Náusea',
      data: '20/08/2004 as 15:00',
      risco: 'Médio',
    }
  ]

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.COMPLETED} />
      </Flex>

      <Table
        className={styles.userTable}
        rowKey='_id'
        dataSource={data}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 10 }}
        size='middle'
        bordered={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default Triages
