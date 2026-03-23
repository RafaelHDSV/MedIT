import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IDoctor } from '@/interfaces/IDoctor'
import type { IError } from '@/interfaces/IError'
import styles from '@/styles/UserTable.module.scss'
import { Flex, message, Table } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import AddDoctorModal from './components/AddDoctorModal/AddDoctorModal'
import { useDoctorsColumns } from './hooks/useDoctorsColumns'

function Doctors() {
  const columns = useDoctorsColumns()
  const [doctors, setDoctors] = useState<IDoctor[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchDoctors() {
    setLoading(true)

    try {
      const response = await api.get('/doctors')
      const data = response.data
      setDoctors(data)
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.error(error)
      message.error(
        error.response?.data?.message ||
          'Erro ao carregar a listagem de médicos'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  return (
    <div className='h-100'>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader
          actionComponent={<AddDoctorModal fetchDoctors={fetchDoctors} />}
        />
        <ProgressTag status={ProgressStatus.COMPLETED} />
      </Flex>

      <Table
        className={styles.userTable}
        rowKey='_id'
        dataSource={doctors}
        columns={columns}
        loading={loading}
        pagination={{ pageSize: 9 }}
        size='middle'
        bordered={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default Doctors
