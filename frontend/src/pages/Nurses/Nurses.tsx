import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IError } from '@/interfaces/IError'
import type { INurse } from '@/interfaces/INurse'
import styles from '@/styles/UserTable.module.scss'
import { Flex, message, Table } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNursesColumns } from './hooks/useNursesColumns'

function Nurses() {
  const columns = useNursesColumns()
  const [nurses, setNurses] = useState<INurse[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchNurses() {
      setLoading(true)

      try {
        const response = await api.get('/nurses')
        const data = response.data
        setNurses(data)
      } catch (err) {
        if (!axios.isAxiosError(err)) return
        const error = err as AxiosError<IError>
        console.error(error)
        message.error(
          error.response?.data?.message ||
            'Erro ao carregar a listagem de enfermeiros'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchNurses()
  }, [])

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader
          actionComponent={<Button>Adicionar enfermeiro</Button>}
        />
        <ProgressTag status={ProgressStatus.COMPLETED} />
      </Flex>

      <Table
        className={styles.userTable}
        rowKey='_id'
        dataSource={nurses}
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

export default Nurses
