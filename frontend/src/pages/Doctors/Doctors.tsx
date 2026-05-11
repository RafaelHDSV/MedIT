import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IDoctor } from '@/interfaces/IDoctor'
import type { IUnit } from '@/interfaces/IUnit'
import { UserLevels } from '@/interfaces/IUser'
import DoctorsRepository from '@/repositories/DoctorsRepository'
import UnitsRepository from '@/repositories/UnitsRepository'
import { Flex } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import DoctorModal from './components/DoctorModal/DoctorModal'
import { useDoctorsColumns } from './hooks/useDoctorsColumns'

function Doctors() {
  const { user } = useAuth()
  const { unitId, level } = user || {}
  const isMedit = level === UserLevels.MEDIT
  const [doctors, setDoctors] = useState<IDoctor[]>([])
  const [units, setUnits] = useState<IUnit[]>([])
  const [loading, setLoading] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null)
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

  const fetchDoctors = useCallback(async () => {
    setLoading(true)

    try {
      const params = isMedit ? {} : { unitId }
      const response = await DoctorsRepository.getDoctors(params)
      setDoctors(response.data ?? [])
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de médicos(as)'
      })
    } finally {
      setLoading(false)
    }
  }, [unitId, isMedit])

  useEffect(() => {
    if (!isMedit && !unitId) return
    fetchDoctors()
  }, [fetchDoctors, isMedit, unitId])

  const columns = useDoctorsColumns({
    setEditingDoctor,
    setEditModalOpen,
    fetchDoctors,
    readOnly: isMedit,
    unitNameById: isMedit ? unitNameById : undefined
  })

  return (
    <>
      {!isMedit && (
        <DoctorModal
          key='edit-doctor-modal'
          doctor={editingDoctor}
          buttonText='Salvar alterações'
          fetchDoctors={fetchDoctors}
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
                <DoctorModal
                  buttonText='Adicionar médico(a)'
                  fetchDoctors={fetchDoctors}
                />
              ) : null
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
