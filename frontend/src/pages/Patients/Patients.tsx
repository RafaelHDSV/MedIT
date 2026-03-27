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
import styles from '../../components/ListTable/ListTable.module.scss'
import PatientModal from './components/PatientModal/PatientModal'
import { usePatientsColumns } from './hooks/usePatientsColumns'

function Patients() {
  const [patients, setPatients] = useState<IPatient[]>([])
  const [loading, setLoading] = useState(false)
  const [editingPatient, setEditingPatient] = useState<IPatient | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

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

  const columns = usePatientsColumns({
    setEditingPatient,
    setEditModalOpen,
    fetchPatients
  })

  return (
    <>
      <PatientModal
        key='edit-patient-modal'
        patient={editingPatient}
        buttonText='Salvar alterações'
        fetchPatients={fetchPatients}
        useOnlyModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
      />

      <div className={styles.tableContent}>
        <Flex vertical className={styles.container}>
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
        </Flex>
      </div>
    </>
  )
}

export default Patients
