import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import type { IDoctor } from '@/interfaces/IDoctor'
import DoctorsRepository from '@/repositories/DoctorsRepository'
import { Flex } from 'antd'
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
      const response = await DoctorsRepository.getDoctors()
      setDoctors(response)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de médicos(as)'
      })
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
          <AuthLayoutHeader
            actionComponent={
              <DoctorModal
                buttonText='Adicionar médico(a)'
                fetchDoctors={fetchDoctors}
              />
            }
          />

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
