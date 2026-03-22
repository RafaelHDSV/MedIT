import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IError } from '@/interfaces/IError'
import type { IPatient } from '@/interfaces/IPatient'
import styles from '@/styles/UserTable.module.scss'
import { Flex, message, Table } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { usePatientsColumns } from './hooks/usePatientsColumns'

function Patients() {
  const columns = usePatientsColumns()
  const [patients, setPatients] = useState<IPatient[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchPatients() {
      setLoading(true)

      try {
        const response = await api.get('/users/level/patient')
        const data = response.data
        setPatients(data)
      } catch (err) {
        if (!axios.isAxiosError(err)) return
        const error = err as AxiosError<IError>
        console.error(error)
        message.error(
          error.response?.data?.message ||
            'Erro ao carregar a listagem de pacientes'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.COMPLETED} />
      </Flex>

      <Table
        className={styles.userTable}
        rowKey='_id'
        dataSource={patients}
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

export default Patients
