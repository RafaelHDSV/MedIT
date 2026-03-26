import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IDoctor } from '@/interfaces/IDoctor'
import type { IError } from '@/interfaces/IError'
import { Flex, message } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import DoctorModal from './components/DoctorModal/DoctorModal'
import { useDoctorsColumns } from './hooks/useDoctorsColumns'

function Doctors() {
  const [doctors, setDoctors] = useState<IDoctor[]>([])
  const [loading, setLoading] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

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
          'Erro ao carregar a listagem de médicos(as)'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctors()
  }, [])

  const columns = useDoctorsColumns({
    setEditingDoctor,
    setEditModalOpen,
    fetchDoctors
  })

  return (
    <>
      <DoctorModal
        key='edit-doctor-modal'
        doctor={editingDoctor}
        buttonText='Salvar alterações'
        fetchDoctors={fetchDoctors}
        useOnlyModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
      />

      <div className={styles.tableContent}>
        <Flex vertical className={styles.container}>
          <Flex gap={16} align='center'>
            <AuthLayoutHeader
              actionComponent={
                <DoctorModal
                  buttonText='Adicionar médico(a)'
                  fetchDoctors={fetchDoctors}
                />
              }
            />
            <ProgressTag status={ProgressStatus.COMPLETED} />
          </Flex>

          <ListTable<IDoctor>
            dataSource={doctors}
            columns={columns}
            loading={loading}
            onReload={fetchDoctors}
          />
        </Flex>
      </div>
    </>
  )
}

export default Doctors
