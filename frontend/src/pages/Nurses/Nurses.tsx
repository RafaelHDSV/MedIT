import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { INurse } from '@/interfaces/INurse'
import NursesRepository from '@/repositories/NursesRepository'
import { Flex } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import NurseModal from './components/NurseModal/NurseModal'
import { useNursesColumns } from './hooks/useNursesColumns'

function Nurses() {
  const { user } = useAuth()
  const { unitId } = user || {}
  const [nurses, setNurses] = useState<INurse[]>([])
  const [loading, setLoading] = useState(false)
  const [editingNurse, setEditingNurse] = useState<INurse | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const fetchNurses = useCallback(async () => {
    setLoading(true)

    try {
      const response = await NursesRepository.getNurses({ unitId })
      setNurses(response)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de enfermeiros'
      })
    } finally {
      setLoading(false)
    }
  }, [unitId])

  useEffect(() => {
    fetchNurses()
  }, [fetchNurses])

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
          <AuthLayoutHeader
            actionComponent={
              <NurseModal
                buttonText='Adicionar enfermeiro(a)'
                fetchNurses={fetchNurses}
              />
            }
          />

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
