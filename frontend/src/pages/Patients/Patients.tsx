import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IPatient } from '@/interfaces/IPatient'
import PatientsRepository from '@/repositories/PatientsRepository'
import { Flex } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import PatientModal from './components/PatientModal/PatientModal'
import { usePatientsColumns } from './hooks/usePatientsColumns'

function Patients() {
  const { user } = useAuth()
  const { unitId } = user || {}
  const [patients, setPatients] = useState<IPatient[]>([])
  const [loading, setLoading] = useState(false)
  const [editingPatient, setEditingPatient] = useState<IPatient | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const fetchPatients = useCallback(async () => {
    setLoading(true)

    try {
      const response = await PatientsRepository.getPatients({ unitId })
      setPatients(response.data)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de pacientes'
      })
    } finally {
      setLoading(false)
    }
  }, [unitId])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

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
          <AuthLayoutHeader />

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
