import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IError } from '@/interfaces/IError'
import type { IPatient } from '@/interfaces/IPatient'
import { Flex, message } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { usePatientsColumns } from './hooks/usePatientsColumns'

function Patients() {
  const columns = usePatientsColumns()
  const [patients, setPatients] = useState<IPatient[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchPatients() {
    setLoading(true)

    try {
      const response = await api.get('/patients')
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

  useEffect(() => {
    fetchPatients()
  }, [])

  return (
    <div className='h-100'>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.COMPLETED} />
      </Flex>

      <ListTable<IPatient>
        dataSource={patients}
        columns={columns}
        loading={loading}
        onReload={fetchPatients}
      />
    </div>
  )
}

export default Patients
