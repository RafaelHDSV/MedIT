import Alert from '@/components/Alert/Alert'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import { AttendanceStatus, type IAttendance } from '@/interfaces/IAttendance'
import type { IDashboardQueueItem } from '@/interfaces/IDashboard'
import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import { UserLevels } from '@/interfaces/IUser'
import DashboardRepository from '@/repositories/DashboardRepository'
import PatientsRepository from '@/repositories/PatientsRepository'
import SymptomsDiseasesRepository from '@/repositories/SymptomsDiseasesRepository'
import { ROUTES } from '@/routes/constants'
import { message } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CurrentConsultCard from './components/CurrentConsultCard'
import LastAttendanceCard from './components/LastAttendanceCard'
import NewConsultCard from './components/NewConsultCard'
import PatientQueueList from './components/PatientQueueList/PatientQueueList'
import QueuePositionCard from './components/QueuePositionCard'
import StatusCard from './components/StatusCard'
import { NEXT_STATUS_MAP, type IPatientQueueItem } from './IPatientDashboard'
import styles from './PatientDashboard.module.scss'

const ACTIVE_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.ON_THE_WAY,
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE
]

const COMPLETED_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.ATTENDANCE_COMPLETED,
  AttendanceStatus.COMPLETED,
  AttendanceStatus.CANCELED
]
const OPERATIONAL_QUEUE_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE
]

interface IPatientDashboardProps {
  reload: boolean
}

function PatientDashboard({ reload }: IPatientDashboardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [patientAttendances, setPatientAttendances] = useState<IAttendance[]>(
    []
  )
  const [patientAttendancesLoading, setPatientAttendancesLoading] =
    useState(true)
  const [queueItems, setQueueItems] = useState<IPatientQueueItem[]>([])
  const [onTheWayQueueItems, setOnTheWayQueueItems] = useState<
    IPatientQueueItem[]
  >([])
  const [queueLoading, setQueueLoading] = useState(true)
  const [symptomOptions, setSymptomOptions] = useState<ISymptomOption[]>([])
  const [arrivalLoading, setArrivalLoading] = useState(false)

  const fetchQueue = useCallback(async () => {
    if (user?.level !== UserLevels.PATIENT || !user?.unitId) {
      setQueueItems([])
      setOnTheWayQueueItems([])
      setQueueLoading(false)
      return
    }

    try {
      setQueueLoading(true)

      const response = await DashboardRepository.getAttendanceQueue({
        params: { unitId: user.unitId, level: user.level }
      })
      const mapped: IPatientQueueItem[] = response.data.map(
        (
          item: Partial<IDashboardQueueItem & { patientId?: string }>,
          index: number
        ) => ({
          _id: item._id,
          number: item.number,
          dailyNumber: item.dailyNumber,
          queuePosition: index + 1,
          patientName: item.patientName,
          status: item.status,
          risk: item.risk,
          isCurrentUser: item.patientId
            ? String(item.patientId) === String(user?._id)
            : false
        })
      )

      const operationalItems = mapped
        .filter((item) => OPERATIONAL_QUEUE_STATUSES.includes(item.status))
        .map((item, index) => ({
          ...item,
          queuePosition: index + 1
        }))

      const preQueueItems = mapped
        .filter((item) => item.status === AttendanceStatus.ON_THE_WAY)
        .map((item, index) => ({
          ...item,
          queuePosition: index + 1
        }))

      setQueueItems(operationalItems)
      setOnTheWayQueueItems(preQueueItems)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao pegar fila de atendimento'
      })
      setQueueItems([])
      setOnTheWayQueueItems([])
    } finally {
      setQueueLoading(false)
    }
  }, [user?._id, user?.level, user?.unitId])

  const fetchPatientAttendances = useCallback(async () => {
    if (user?.level !== UserLevels.PATIENT || !user?._id) return

    try {
      setPatientAttendancesLoading(true)

      const response = await PatientsRepository.getAttendances({
        patientId: user._id
      })
      const list = response.data as IAttendance[]
      list.sort((a, b) => {
        const tb = dayjs(b.updatedAt ?? b.date).valueOf()
        const ta = dayjs(a.updatedAt ?? a.date).valueOf()
        return tb - ta
      })
      setPatientAttendances(list)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao pegar atendimentos do paciente'
      })
    } finally {
      setPatientAttendancesLoading(false)
    }
  }, [user?._id, user?.level])

  const fetchSymptomOptions = useCallback(async () => {
    try {
      const response = await SymptomsDiseasesRepository.getSymptomOptions()
      setSymptomOptions(response?.data?.symptoms ?? [])
    } catch {
      // fallback silencioso — sintomas serão exibidos sem tradução
    }
  }, [])

  useEffect(() => {
    fetchQueue()
    fetchPatientAttendances()
    fetchSymptomOptions()
  }, [fetchQueue, fetchPatientAttendances, fetchSymptomOptions, reload])

  const activeAttendance: Partial<IAttendance> | null = useMemo(() => {
    if (!patientAttendances.length) return null
    return (
      patientAttendances.find((a) => ACTIVE_STATUSES.includes(a.status)) ?? null
    )
  }, [patientAttendances])

  const lastAttendance: Partial<IAttendance> | null = useMemo(() => {
    if (!patientAttendances.length) return null
    const completed = patientAttendances.filter((a) =>
      COMPLETED_STATUSES.includes(a.status)
    )
    if (!completed.length) return null
    const last = completed[0]
    return {
      _id: last._id,
      date: last.date,
      doctorId: last.doctorId,
      doctorName: last.doctorName,
      unitId: last.unitId,
      unitName: last.unitName,
      diagnosisKey: last.diagnosisKey,
      generalObservation: last.generalObservation,
      prescribedMedications: last.prescribedMedications
    }
  }, [patientAttendances])

  const { myQueueItem, inAttendanceCount, patientsAheadCount } = useMemo(() => {
    const myQueueItem = queueItems.find((q) => q.isCurrentUser)
    return {
      myQueueItem,
      inAttendanceCount: queueItems.filter(
        (q) => q.status === AttendanceStatus.IN_ATTENDANCE
      ).length,
      patientsAheadCount: queueItems.filter(
        (q) =>
          !q.isCurrentUser &&
          q.queuePosition < (myQueueItem?.queuePosition ?? Infinity) &&
          !COMPLETED_STATUSES.includes(q.status)
      ).length
    }
  }, [queueItems])

  const nextStatus = useMemo(() => {
    if (!activeAttendance?.status) return null
    return NEXT_STATUS_MAP[activeAttendance.status as AttendanceStatus] ?? null
  }, [activeAttendance])

  const handleConfirmArrival = async () => {
    if (!activeAttendance?._id) return
    try {
      setArrivalLoading(true)
      await PatientsRepository.confirmPatientArrival({
        attendanceId: String(activeAttendance._id)
      })
      message.success(
        'Chegada confirmada. Você entrou na fila de triagem da unidade.'
      )
      await Promise.all([fetchQueue(), fetchPatientAttendances()])
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Não foi possível confirmar sua chegada.'
      })
    } finally {
      setArrivalLoading(false)
    }
  }

  const isLoading = patientAttendancesLoading || queueLoading || arrivalLoading

  return (
    <>
      {!isLoading && myQueueItem && patientsAheadCount <= 3 && (
        <Alert
          className={styles.alertBanner}
          message={
            patientsAheadCount === 0
              ? 'Chegou a sua vez! Dirija-se para a sua consulta.'
              : `Faltam ${patientsAheadCount} paciente${patientsAheadCount !== 1 ? 's' : ''} para sua consulta`
          }
          type='info'
        />
      )}

      <QueuePositionCard
        loading={isLoading}
        myQueueItem={myQueueItem}
        inAttendanceCount={inAttendanceCount}
        queueItems={queueItems}
      />

      <StatusCard
        loading={isLoading}
        status={activeAttendance?.status}
        nextStatus={nextStatus}
      />

      {activeAttendance ? (
        <CurrentConsultCard
          attendance={activeAttendance}
          symptomOptions={symptomOptions}
          onConfirmArrival={
            activeAttendance.status === AttendanceStatus.ON_THE_WAY
              ? handleConfirmArrival
              : undefined
          }
          arrivalLoading={isLoading}
        />
      ) : (
        <NewConsultCard
          loading={isLoading}
          onClick={() => navigate(ROUTES.PRE_REGISTRATION.path)}
        />
      )}

      <PatientQueueList
        operationalQueueItems={queueItems}
        onTheWayQueueItems={onTheWayQueueItems}
        totalActiveCount={queueItems.length + onTheWayQueueItems.length}
        loading={isLoading}
      />

      {lastAttendance && (
        <LastAttendanceCard attendance={lastAttendance} loading={isLoading} />
      )}
    </>
  )
}

export default PatientDashboard
