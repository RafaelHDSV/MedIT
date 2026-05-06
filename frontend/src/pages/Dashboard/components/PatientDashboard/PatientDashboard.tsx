import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import {
  AttendanceStatus,
  AttendanceStatusLabels,
  type IAttendance
} from '@/interfaces/IAttendance'
import DashboardRepository from '@/repositories/DashboardRepository'
import PatientsRepository from '@/repositories/PatientsRepository'
import { ROUTES } from '@/routes/constants'
import {
  BellSimpleRingingIcon,
  BuildingsIcon,
  CalendarBlankIcon,
  PencilSimpleIcon,
  PlusIcon,
  UserIcon,
  UsersThreeIcon
} from '@phosphor-icons/react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  IActiveAttendance,
  ILastAttendance,
  IPatientQueueItem
} from './IPatientDashboard'
import { nextStatusMap } from './IPatientDashboard'
import styles from './PatientDashboard.module.scss'

dayjs.locale('pt-br')

interface IPatientDashboardProps {
  /** Lista completa de atendimentos do paciente, já carregada pelo Dashboard pai */
  attendances: IAttendance[]
  /** Sinaliza quando o pai está recarregando dados */
  parentLoading: boolean
  /** Callback para forçar reload no pai */
  onReload: () => void
}

// ─── Helpers ────────────────────────────────────────────────────────────────────
const ACTIVE_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.ON_THE_WAY,
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE,
  AttendanceStatus.ATTENDANCE_COMPLETED
]

const COMPLETED_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.COMPLETED,
  AttendanceStatus.CANCELED
]

const QUEUE_VISIBLE_LIMIT = 7

function formatDate(date: Date | string | undefined): string {
  if (!date) return '-'
  return dayjs(date).format('DD/MM/YYYY')
}

// ─── Sub-componente: Fila de atendimento ────────────────────────────────────────
function QueueList({
  items,
  loading
}: {
  items: IPatientQueueItem[]
  loading: boolean
}) {
  const [showAll, setShowAll] = useState(false)

  const visible = useMemo(
    () => (showAll ? items : items.slice(0, QUEUE_VISIBLE_LIMIT)),
    [items, showAll]
  )

  const hiddenCount = items.length - QUEUE_VISIBLE_LIMIT

  if (loading) {
    return (
      <div className={styles.queueCard}>
        <div className={styles.queueCardHeader}>
          <h3>Fila de Atendimento</h3>
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.queueItem} style={{ opacity: 0.4 }}>
            <div
              className={styles.positionBall}
              style={{ background: '#e0e0e0' }}
            />
            <div className={styles.queueItemInfo}>
              <div className={`${styles.skeletonText}`} />
              <div
                className={`${styles.skeletonText}`}
                style={{ width: '50%' }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.queueCard}>
      <div className={styles.queueCardHeader}>
        <h3>Fila de Atendimento</h3>
        {items.length > 0 && (
          <span className={styles.queueCount}>
            <UsersThreeIcon size={16} />
            {items.length} atendimento{items.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p style={{ fontSize: '0.85rem', color: 'var(--light-gray)' }}>
          Nenhum paciente na fila no momento.
        </p>
      ) : (
        <>
          {visible.map((item) => (
            <div
              key={item._id}
              className={`${styles.queueItem} ${item.isCurrentUser ? styles.currentUser : ''}`}
            >
              {/* Bolinha com número */}
              <span className={styles.positionBall}>{item.number ?? '?'}</span>

              {/* Nome + status */}
              <div className={styles.queueItemInfo}>
                <p className={styles.queueItemName}>{item.patientName}</p>
                <p className={styles.queueItemStatus}>
                  {AttendanceStatusLabels[item.status]}
                </p>
              </div>

              {/* RiskTag */}
              <RiskTag risk={item.risk} useTooltip={false} />
            </div>
          ))}

          {!showAll && hiddenCount > 0 && (
            <button
              className={styles.queueShowMore}
              onClick={() => setShowAll(true)}
            >
              + {hiddenCount} atendimento{hiddenCount !== 1 ? 's' : ''}
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────────
function PatientDashboard({
  attendances,
  parentLoading,
  onReload
}: IPatientDashboardProps) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [queueItems, setQueueItems] = useState<IPatientQueueItem[]>([])
  const [queueLoading, setQueueLoading] = useState(true)

  // ── Consulta ativa (não concluída e não cancelada) ──
  const activeAttendance: IActiveAttendance | null = useMemo(() => {
    if (!attendances.length) return null
    return (
      (attendances.find((a) => ACTIVE_STATUSES.includes(a.status)) as
        | IActiveAttendance
        | undefined) ?? null
    )
  }, [attendances])

  // ── Último atendimento concluído ──
  const lastAttendance: ILastAttendance | null = useMemo(() => {
    if (!attendances.length) return null
    const completed = attendances.filter((a) =>
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
  }, [attendances])

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
          isCurrentUser: activeAttendance
            ? String(item._id) === String(activeAttendance._id)
            : false
        })
      )

      setQueueItems(mapped)
    } catch {
      setQueueItems([])
    } finally {
      setQueueLoading(false)
    }
  }, [user?.unitId, activeAttendance])

  useEffect(() => {
    void fetchQueue()
  }, [fetchQueue])

  // ─── Render ──────────────────────────────────────────────────────────────────
  const hasActiveAttendance = Boolean(activeAttendance)

  return (
    <div className={styles.wrapper}>
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
      <div className={styles.queuePositionCard}>
        <span className={styles.queuePosLabel}>Sua posição na fila</span>

        {parentLoading || queueLoading ? (
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
      <div className={styles.statusCard}>
        <span className={styles.statusLabel}>Seu status atual é</span>

        {parentLoading ? (
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
        <div className={styles.currentConsultCard}>
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
              {formatDate(activeAttendance.symptomStartDate as Date)}
            </span>
          </div>

          <div className={styles.currentConsultRow}>
            <span className={styles.rowLabel}>Chegada</span>
            <span className={styles.rowValue}>
              {formatDate(activeAttendance.date as Date)}
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
      <QueueList items={queueItems} loading={queueLoading} />

      {/* ── Último atendimento ── */}
      {lastAttendance && (
        <div className={styles.lastAttendanceCard}>
          <h3>Último atendimento</h3>

          <div className={styles.lastAttendanceInfo}>
            {lastAttendance.date && (
              <div className={styles.infoRow}>
                <CalendarBlankIcon size={16} />
                <span>
                  <strong>Data:</strong> {formatDate(lastAttendance.date)}
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
    </div>
  )
}

export default PatientDashboard
