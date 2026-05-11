import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { INurse } from '@/interfaces/INurse'
import type { IUnit } from '@/interfaces/IUnit'
import { UserLevels } from '@/interfaces/IUser'
import NursesRepository from '@/repositories/NursesRepository'
import UnitsRepository from '@/repositories/UnitsRepository'
import { Flex } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import NurseModal from './components/NurseModal/NurseModal'
import { useNursesColumns } from './hooks/useNursesColumns'

function Nurses() {
  const { user } = useAuth()
  const { unitId, level } = user || {}
  const isMedit = level === UserLevels.MEDIT
  const [nurses, setNurses] = useState<INurse[]>([])
  const [units, setUnits] = useState<IUnit[]>([])
  const [loading, setLoading] = useState(false)
  const [editingNurse, setEditingNurse] = useState<INurse | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const unitNameById = useMemo(() => {
    const unitMap = new Map<string, string>()
    units.forEach((u) => unitMap.set(String(u._id), u.name))
    return unitMap
  }, [units])

  const fetchUnits = useCallback(async () => {
    if (!isMedit) return
    try {
      const response = await UnitsRepository.getAllUnits()
      setUnits(response.data ?? [])
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao carregar unidades' })
    }
  }, [isMedit])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  const fetchNurses = useCallback(async () => {
    setLoading(true)

    try {
      const params = isMedit ? {} : { unitId }
      const response = await NursesRepository.getNurses(params)
      setNurses(response.data ?? [])
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de enfermeiros'
      })
    } finally {
      setLoading(false)
    }
  }, [unitId, isMedit])

  useEffect(() => {
    if (!isMedit && !unitId) return
    fetchNurses()
  }, [fetchNurses, isMedit, unitId])

  const columns = useNursesColumns({
    setEditingNurse,
    setEditModalOpen,
    fetchNurses,
    readOnly: isMedit,
    unitNameById: isMedit ? unitNameById : undefined
  })

  return (
    <>
      {!isMedit && (
        <NurseModal
          key='edit-nurse-modal'
          nurse={editingNurse}
          buttonText='Salvar alterações'
          fetchNurses={fetchNurses}
          useOnlyModal
          editModalOpen={editModalOpen}
          setEditModalOpen={setEditModalOpen}
        />
      )}

      <div className={styles.tableContent}>
        <Flex vertical className={styles.container}>
          <AuthLayoutHeader
            actionComponent={
              !isMedit ? (
                <NurseModal
                  buttonText='Adicionar enfermeiro(a)'
                  fetchNurses={fetchNurses}
                />
              ) : null
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
