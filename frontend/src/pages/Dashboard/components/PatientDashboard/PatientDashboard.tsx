import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { Periods } from '@/interfaces/globals'
import {
  AttendanceStatus,
  AttendanceStatusLabels,
  type IAttendance
} from '@/interfaces/IAttendance'
import { UserLevels } from '@/interfaces/IUser'
import DashboardRepository from '@/repositories/DashboardRepository'
import PatientsRepository from '@/repositories/PatientsRepository'
import { ROUTES } from '@/routes/constants'
import { formatDate } from '@/utils/formatDate'
import {
  BellSimpleRingingIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  PencilSimpleIcon,
  PlusIcon,
  UserIcon
} from '@phosphor-icons/react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AttendanceQueueChart from '../AttendanceQueueChart/AttendanceQueueChart'
import type {
  IActiveAttendance,
  ILastAttendance,
  IPatientQueueItem
} from './IPatientDashboard'
import { nextStatusMap } from './IPatientDashboard'
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
  AttendanceStatus.COMPLETED,
  AttendanceStatus.CANCELED
]

interface IPatientDashboardProps {
  reload: boolean
  selectedPeriod: Periods
  referenceDate: string
}

function PatientDashboard({
  reload,
  selectedPeriod,
  referenceDate
}: IPatientDashboardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [patientAttendances, setPatientAttendances] = useState<IAttendance[]>(
    []
  )
  const [patientAttendancesLoading, setPatientAttendancesLoading] =
    useState(true)
  const [queueItems, setQueueItems] = useState<IPatientQueueItem[]>([])
  const [queueLoading, setQueueLoading] = useState(true)

  // ── Consulta ativa (não concluída e não cancelada) ──
  const activeAttendance: IActiveAttendance | null = useMemo(() => {
    if (!patientAttendances.length) return null
    return (
      (patientAttendances.find((a) => ACTIVE_STATUSES.includes(a.status)) as
        | IActiveAttendance
        | undefined) ?? null
    )
  }, [patientAttendances])

  // ── Último atendimento concluído ──
  const lastAttendance: ILastAttendance | null = useMemo(() => {
    if (!patientAttendances.length) return null
    const completed = patientAttendances.filter((a) =>
      COMPLETED_STATUSES.includes(a.status)
    )
    if (!completed.length) return null
    const last = completed[0] // já ordenado por createdAt desc no backend
    return {
      _id: String(last._id),
      date: last.date,
      diagnosisKey: last.diagnosisKey,
      generalObservation: last.generalObservation,
      prescribedMedications: last.prescribedMedications
    }
  }, [patientAttendances])

  // ── Posição do paciente na fila ──
  const myQueueItem = useMemo(
    () => queueItems.find((q) => q.isCurrentUser),
    [queueItems]
  )

  // ── Status seguinte ──
  const nextStatus = useMemo(() => {
    if (!activeAttendance?.status) return null
    return nextStatusMap[activeAttendance.status] ?? null
  }, [activeAttendance])

  // ── Quantos pacientes estão sendo atendidos ──
  const inAttendanceCount = useMemo(
    () =>
      queueItems.filter((q) => q.status === AttendanceStatus.IN_ATTENDANCE)
        .length,
    [queueItems]
  )

  // ── Banner de aviso (faltam N pacientes) ──
  const patientsAheadCount = useMemo(() => {
    if (!myQueueItem?.number) return null
    const ahead = queueItems.filter(
      (q) =>
        !q.isCurrentUser &&
        (q.number ?? 0) < (myQueueItem.number ?? 0) &&
        !COMPLETED_STATUSES.includes(q.status)
    ).length
    return ahead
  }, [myQueueItem, queueItems])

  // ── Fetch fila da unidade ──
  const fetchQueue = useCallback(async () => {
    if (!user?.unitId) {
      setQueueLoading(false)
      return
    }
    setQueueLoading(true)
    try {
      const response = await DashboardRepository.getAttendanceQueue({
        params: { unitId: user.unitId }
      })

      // A API retorna IDashboardQueueItem[] dentro de response.data
      const raw = (response as unknown as { data: unknown }).data
      const list = Array.isArray(raw) ? raw : []

      const mapped: IPatientQueueItem[] = list.map(
        (item: {
          _id: string
          number?: number
          patientName: string
          status: AttendanceStatus
          risk: import('@/interfaces/IAttendance').AttendanceRisk
          patientId?: string
        }) => ({
          _id: item._id,
          number: item.number,
          patientName: item.patientName,
          status: item.status,
          risk: item.risk,
          isCurrentUser: item.patientId
            ? String(item.patientId) === String(user?._id)
            : false
        })
      )

      setQueueItems(mapped)
    } catch {
      setQueueItems([])
    } finally {
      setQueueLoading(false)
    }
  }, [user?._id, user?.unitId])

  const fetchPatientActiveAttendance = useCallback(async () => {
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

  useEffect(() => {
    fetchQueue()
    fetchPatientActiveAttendance()
  }, [fetchQueue, fetchPatientActiveAttendance, reload])

  // ─── Render ──────────────────────────────────────────────────────────────────
  const hasActiveAttendance = Boolean(activeAttendance)

  return (
    <>
      {/* ── Banner de notificação ── */}
      {patientsAheadCount !== null && patientsAheadCount <= 3 && (
        <div className={styles.alertBanner}>
          <BellSimpleRingingIcon size={20} weight='fill' />
          {patientsAheadCount === 0
            ? 'É a sua vez! Dirija-se ao guichê de atendimento.'
            : `Faltam ${patientsAheadCount} paciente${patientsAheadCount !== 1 ? 's' : ''} para sua consulta`}
        </div>
      )}

      {/* ── Posição na fila ── */}
      <div
        className={styles.queuePositionCard}
        style={{ gridArea: 'positionQueue' }}
      >
        <span className={styles.queuePosLabel}>Sua posição na fila</span>

        {patientAttendancesLoading || queueLoading ? (
          <div className={styles.skeletonLarge} />
        ) : myQueueItem?.number ? (
          <span className={styles.queuePosNumber}>{myQueueItem.number}º</span>
        ) : (
          <span className={styles.queuePosEmpty}>—</span>
        )}

        <span className={styles.queuePosSubInfo}>
          {inAttendanceCount > 0 ? (
            <>
              Atendendo paciente n°{' '}
              <strong>
                {queueItems.find(
                  (q) => q.status === AttendanceStatus.IN_ATTENDANCE
                )?.number ?? '?'}
              </strong>
            </>
          ) : (
            'Nenhum paciente em atendimento'
          )}
        </span>
      </div>

      {/* ── Status atual ── */}
      <div className={styles.statusCard} style={{ gridArea: 'status' }}>
        <span className={styles.statusLabel}>Seu status atual é</span>

        {patientAttendancesLoading ? (
          <div className={styles.skeletonLarge} />
        ) : activeAttendance?.status ? (
          <>
            <span className={styles.statusValue}>
              {AttendanceStatusLabels[activeAttendance.status]}
            </span>
            {nextStatus && (
              <span className={styles.statusNext}>
                Seu próximo status é{' '}
                <span>{AttendanceStatusLabels[nextStatus]}</span>
              </span>
            )}
          </>
        ) : (
          <span className={styles.statusEmpty}>—</span>
        )}
      </div>

      {/* ── Consulta atual OU botão nova consulta ── */}
      {hasActiveAttendance && activeAttendance ? (
        <div
          className={styles.currentConsultCard}
          style={{ gridArea: 'currentAttendance' }}
        >
          <div className={styles.currentConsultHeader}>
            <h3>Consulta atual</h3>
            <button
              className={styles.editBtn}
              onClick={() => navigate(ROUTES.PRE_REGISTRATION.path)}
              title='Editar pré-atendimento'
              aria-label='Editar pré-atendimento'
            >
              <PencilSimpleIcon size={16} weight='bold' />
            </button>
          </div>

          <div className={styles.currentConsultRow}>
            <span className={styles.rowLabel}>Nível de dor</span>
            <span className={styles.rowValue}>
              {activeAttendance.painLevel ?? '-'}
            </span>
          </div>

          <div className={styles.currentConsultRow}>
            <span className={styles.rowLabel}>Queixa principal</span>
            <span className={styles.rowValue}>
              {activeAttendance.complaint ?? '-'}
            </span>
          </div>

          <div className={styles.currentConsultRow}>
            <span className={styles.rowLabel}>Se automedicou?</span>
            <span className={styles.rowValue}>
              {activeAttendance.selfMedicated === true
                ? 'Sim'
                : activeAttendance.selfMedicated === false
                  ? 'Não'
                  : '-'}
            </span>
          </div>

          <div className={styles.currentConsultRow}>
            <span className={styles.rowLabel}>
              Quando os sintomas começaram?
            </span>
            <span className={styles.rowValue}>
              {formatDate({
                date: activeAttendance.symptomStartDate as Date,
                mode: 'date'
              })}
            </span>
          </div>

          <div className={styles.currentConsultRow}>
            <span className={styles.rowLabel}>Chegada</span>
            <span className={styles.rowValue}>
              {formatDate({
                date: activeAttendance.date as Date,
                mode: 'date'
              })}
            </span>
          </div>

          {activeAttendance.symptoms &&
            activeAttendance.symptoms.length > 0 && (
              <div className={styles.currentConsultRow}>
                <span className={styles.rowLabel}>Sintomas</span>
                <span className={styles.rowValue}>
                  {activeAttendance.symptoms.join(', ')}
                </span>
              </div>
            )}
        </div>
      ) : (
        /* Card de nova consulta */
        <div
          className={styles.newConsultCard}
          onClick={() => navigate(ROUTES.PRE_REGISTRATION.path)}
          role='button'
          tabIndex={0}
          id='patient-new-consult-btn'
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ')
              navigate(ROUTES.PRE_REGISTRATION.path)
          }}
        >
          <div className={styles.plusBtn}>
            <PlusIcon size={40} weight='bold' />
          </div>
          <p>Clique para iniciar uma nova consulta</p>
        </div>
      )}

      {/* ── Fila de atendimento ── */}
      {/* <QueueList items={queueItems} loading={queueLoading} /> */}
      <AttendanceQueueChart
        reload={reload}
        selectedPeriod={selectedPeriod}
        referenceDate={formatDate({
          date: referenceDate,
          mode: 'serverCompleteDate'
        })}
      />

      {/* ── Último atendimento ── */}
      {lastAttendance && (
        <div
          className={styles.lastAttendanceCard}
          style={{ gridArea: 'lastAttendance' }}
        >
          <h3>Último atendimento</h3>

          <div className={styles.lastAttendanceInfo}>
            {lastAttendance.date && (
              <div className={styles.infoRow}>
                <CalendarBlankIcon size={16} />
                <span>
                  <strong>Data:</strong>{' '}
                  {formatDate({
                    date: lastAttendance.date as Date,
                    mode: 'date'
                  })}
                </span>
              </div>
            )}
            {lastAttendance.doctorName && (
              <div className={styles.infoRow}>
                <UserIcon size={16} />
                <span>
                  <strong>Médico:</strong> {lastAttendance.doctorName}
                </span>
              </div>
            )}
            {lastAttendance.unitName && (
              <div className={styles.infoRow}>
                <BuildingsIcon size={16} />
                <span>
                  <strong>Unidade:</strong> {lastAttendance.unitName}
                </span>
              </div>
            )}
          </div>

          {lastAttendance.diagnosisKey && (
            <p className={styles.diagnosisRow}>
              Diagnóstico:{' '}
              <span className={styles.diagnosisCode}>
                {lastAttendance.diagnosisKey}
              </span>
            </p>
          )}

          {lastAttendance.prescribedMedications &&
            lastAttendance.prescribedMedications.length > 0 && (
              <p className={styles.lastMedication}>
                <span>Medicação:</span>{' '}
                {lastAttendance.prescribedMedications
                  .map((m) => m.name)
                  .join(', ')}
              </p>
            )}

          {lastAttendance.generalObservation && (
            <p className={styles.lastObservation}>
              <span>Orientação:</span> {lastAttendance.generalObservation}
            </p>
          )}
        </div>
      )}
    </>
  )
}

export default PatientDashboard
