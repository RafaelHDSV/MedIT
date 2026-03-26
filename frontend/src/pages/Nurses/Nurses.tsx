import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IError } from '@/interfaces/IError'
import type { INurse } from '@/interfaces/INurse'
import { Flex, message } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import NurseModal from './components/NurseModal/NurseModal'
import { useNursesColumns } from './hooks/useNursesColumns'

function Nurses() {
  const [nurses, setNurses] = useState<INurse[]>([])
  const [loading, setLoading] = useState(false)
  const [editingNurse, setEditingNurse] = useState<INurse | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

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

  useEffect(() => {
    fetchNurses()
  }, [])

  const columns = useNursesColumns({
    setEditingNurse,
    setEditModalOpen,
    fetchNurses
  })

  return (
    <>
      <NurseModal
        key='edit-nurse-modal'
        nurse={editingNurse}
        buttonText='Salvar alterações'
        fetchNurses={fetchNurses}
        useOnlyModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
      />

      <div className={styles.tableContent}>
        <Flex vertical className={styles.container}>
          <Flex gap={16} align='center'>
            <AuthLayoutHeader
              actionComponent={
                <NurseModal
                  buttonText='Adicionar enfermeiro(a)'
                  fetchNurses={fetchNurses}
                />
              }
            />
            <ProgressTag status={ProgressStatus.COMPLETED} />
          </Flex>

          <ListTable<INurse>
            dataSource={nurses}
            columns={columns}
            loading={loading}
            onReload={fetchNurses}
          />
        </Flex>
      </div>
    </>
  )
}

export default Nurses
