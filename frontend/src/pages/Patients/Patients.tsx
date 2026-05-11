import Alert from '@/components/Alert/Alert'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IPatient } from '@/interfaces/IPatient'
import type { IUnit } from '@/interfaces/IUnit'
import { UserLevels } from '@/interfaces/IUser'
import PatientsRepository from '@/repositories/PatientsRepository'
import UnitsRepository from '@/repositories/UnitsRepository'
import { Flex } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import PatientModal from './components/PatientModal/PatientModal'
import { usePatientsColumns } from './hooks/usePatientsColumns'

function Patients() {
  const { user } = useAuth()
  const { unitId, level } = user || {}
  const isMedit = level === UserLevels.MEDIT
  const [patients, setPatients] = useState<IPatient[]>([])
  const [units, setUnits] = useState<IUnit[]>([])
  const [loading, setLoading] = useState(false)
  const [editingPatient, setEditingPatient] = useState<IPatient | null>(null)
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

  const fetchPatients = useCallback(async () => {
    setLoading(true)

    try {
      const params = isMedit ? {} : { unitId }
      const response = await PatientsRepository.getPatients(params)
      setPatients(response.data ?? [])
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar a listagem de pacientes'
      })
    } finally {
      setLoading(false)
    }
  }, [unitId, isMedit])

  useEffect(() => {
    if (!isMedit && !unitId) return
     fetchPatients()
  }, [fetchPatients, isMedit, unitId])

  const columns = usePatientsColumns({
    setEditingPatient,
    setEditModalOpen,
    fetchPatients,
    readOnly: isMedit,
    unitNameById: isMedit ? unitNameById : undefined
  })

  return (
    <>
      {!isMedit && (
        <PatientModal
          key='edit-patient-modal'
          patient={editingPatient}
          buttonText='Salvar alterações'
          fetchPatients={fetchPatients}
          useOnlyModal
          editModalOpen={editModalOpen}
          setEditModalOpen={setEditModalOpen}
        />
      )}

      <div className={styles.tableContent}>
        <Flex vertical className={styles.container}>
          <Alert
            type='info'
            message='O cadastro de pacientes é realizado exclusivamente pelo próprio paciente na página de SignUp.'
          />
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
