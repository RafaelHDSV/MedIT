import Button from '@/components/Button/Button'
import DashboardCard from '@/components/DashboardCard/DashboardCard'
import Empty from '@/components/Empty/Empty'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { Periods } from '@/interfaces/globals'
import {
  AttendanceStatus,
  AttendanceStatusLabels
} from '@/interfaces/IAttendance'
import type {
  IDashboardQueueItem,
  IDashboardRecentCompletedItem
} from '@/interfaces/IDashboard'
import { UserLevels } from '@/interfaces/IUser'
import DashboardRepository from '@/repositories/DashboardRepository'
import { ArrowsOutIcon, StethoscopeIcon } from '@phosphor-icons/react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { createPortal } from 'react-dom'
import styles from './AttendanceQueueChart.module.scss'
import AttendanceQueueChartAdmin from './components/AttendanceQueueChartAdmin/AttendanceQueueChartAdmin'
import AttendanceQueueChartDoctor from './components/AttendanceQueueChartDoctor/AttendanceQueueChartDoctor'
import AttendanceQueueChartNurse from './components/AttendanceQueueChartNurse/AttendanceQueueChartNurse'

export interface IAttendanceItemProps {
  item?: IDashboardQueueItem
  loading?: boolean
}

const TV_POLL_MS = 60_000
const MAX_NEXT = 8
const WAITING_PIPELINE: AttendanceStatus[] = [
  AttendanceStatus.ON_THE_WAY,
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE
]

function ticketLabel(item: IDashboardQueueItem) {
  return item.dailyNumber != null ? String(item.dailyNumber) : '—'
}

function AttendanceItem({ item, loading }: IAttendanceItemProps) {
  const { user } = useAuth()

  switch (user?.level) {
    case 'medit':
    case 'admin':
      return <AttendanceQueueChartAdmin item={item} loading={loading} />
    case 'doctor':
      return <AttendanceQueueChartDoctor item={item} loading={loading} />
    case 'nurse':
      return <AttendanceQueueChartNurse item={item} loading={loading} />
    default:
      return <></>
  }
}

interface IAttendanceQueueChartProps {
  reload: boolean
  selectedPeriod?: Periods
  referenceDate?: string
}

function AttendanceQueueChart({
  reload,
  selectedPeriod,
  referenceDate
}: IAttendanceQueueChartProps) {
  const { user } = useAuth()
  const [data, setData] = useState<IDashboardQueueItem[]>([])
  const [recentCompleted, setRecentCompleted] = useState<
    IDashboardRecentCompletedItem[]
  >([])
  const [loading, setLoading] = useState(true)
  const [tvOpen, setTvOpen] = useState(false)

  const tvRootRef = useRef<HTMLDivElement>(null)
  const enteredFullscreenRef = useRef(false)

  const queueParams = useMemo(() => {
    const params: {
      period?: Periods
      referenceDate?: string
      level?: UserLevels
      unitId?: string
    } = {
      level: user?.level
    }
    if (user?.unitId) {
      params.unitId = String(user.unitId)
    }
    if (selectedPeriod !== undefined) params.period = selectedPeriod
    if (referenceDate !== undefined) params.referenceDate = referenceDate
    return params
  }, [user?.unitId, user?.level, selectedPeriod, referenceDate])

  const fetchQueue = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent === true
      if (!silent) setLoading(true)

      try {
        const response = await DashboardRepository.getAttendanceQueue({
          params: queueParams
        })
        setData(response.data)
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Erro ao pegar fila de atendimento'
        })
      } finally {
        if (!silent) setLoading(false)
      }
    },
    [queueParams]
  )

  const fetchRecentCompleted = useCallback(
    async (options?: { silent?: boolean }) => {
      const silent = options?.silent === true
      if (!user?.unitId) {
        setRecentCompleted([])
        return
      }
      try {
        const response = await DashboardRepository.getRecentCompletedQueue({
          params: { unitId: String(user.unitId) }
        })
        setRecentCompleted(response.data ?? [])
      } catch (err) {
        if (!silent) {
          handleApiError({
            err,
            defaultMessage: 'Erro ao carregar últimos atendimentos concluídos'
          })
        }
      }
    },
    [user?.unitId]
  )

  useEffect(() => {
    void fetchQueue()
  }, [fetchQueue, reload])

  useEffect(() => {
    if (!tvOpen) return
    const id = window.setInterval(() => {
      void fetchQueue({ silent: true })
      void fetchRecentCompleted({ silent: true })
    }, TV_POLL_MS)
    return () => window.clearInterval(id)
  }, [tvOpen, fetchQueue, fetchRecentCompleted])

  useEffect(() => {
    if (!tvOpen) return
    void fetchRecentCompleted()
  }, [tvOpen, fetchRecentCompleted])

  const tvBoard = useMemo(() => {
    const level = user?.level

    if (level === UserLevels.DOCTOR) {
      const hero = data[0]
      return {
        hero: hero
          ? {
              item: hero,
              caption: 'Próximo na fila',
              sub: 'Aguardando atendimento médico'
            }
          : null,
        next: data.slice(1, 1 + MAX_NEXT)
      }
    }

    if (level === UserLevels.NURSE) {
      const hero = data[0]
      return {
        hero: hero
          ? {
              item: hero,
              caption: 'Próximo na triagem',
              sub: 'Aguardando receber triagem'
            }
          : null,
        next: data.slice(1, 1 + MAX_NEXT)
      }
    }

    if (level === UserLevels.ADMIN || level === UserLevels.MEDIT) {
      const inAtt = data.find(
        (i) => i.status === AttendanceStatus.IN_ATTENDANCE
      )
      const inTri = data.find((i) => i.status === AttendanceStatus.IN_TRIAGE)
      const firstWait = data.find((i) =>
        WAITING_PIPELINE.includes(i.status as AttendanceStatus)
      )

      const heroItem = inAtt ?? inTri ?? firstWait ?? null

      let caption = 'Atendimento em andamento'
      let sub = ''

      if (inAtt) {
        caption = 'Em atendimento médico'
        sub = AttendanceStatusLabels[AttendanceStatus.IN_ATTENDANCE]
      } else if (inTri) {
        caption = 'Em triagem'
        sub = AttendanceStatusLabels[AttendanceStatus.IN_TRIAGE]
      } else if (firstWait) {
        caption = 'Próximo na fila'
        sub = AttendanceStatusLabels[firstWait.status]
      }

      if (!heroItem) {
        return { hero: null, next: [] as IDashboardQueueItem[] }
      }

      const next = data
        .filter(
          (i) =>
            i._id !== heroItem._id &&
            WAITING_PIPELINE.includes(i.status as AttendanceStatus)
        )
        .slice(0, MAX_NEXT)

      return {
        hero: { item: heroItem, caption, sub },
        next
      }
    }

    return { hero: null, next: [] as IDashboardQueueItem[] }
  }, [data, user?.level])

  const closeTv = useCallback(async () => {
    try {
      if (document.fullscreenElement === tvRootRef.current) {
        await document.exitFullscreen()
      }
    } catch {
      /* ignore */
    }
    enteredFullscreenRef.current = false
    setTvOpen(false)
  }, [])

  const openTv = useCallback(() => {
    enteredFullscreenRef.current = false
    setTvOpen(true)
  }, [])

  useLayoutEffect(() => {
    if (!tvOpen) return
    const el = tvRootRef.current
    if (!el) return
    let cancelled = false
    void (async () => {
      try {
        await el.requestFullscreen()
        if (!cancelled) enteredFullscreenRef.current = true
      } catch {
        enteredFullscreenRef.current = false
      }
    })()
    return () => {
      cancelled = true
    }
  }, [tvOpen])

  useEffect(() => {
    if (!tvOpen) return
    const onChange = () => {
      if (!enteredFullscreenRef.current) return
      if (document.fullscreenElement == null) {
        enteredFullscreenRef.current = false
        setTvOpen(false)
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [tvOpen])

  const cardConfig = useMemo(() => {
    switch (user?.level) {
      case 'nurse':
        return {
          title: 'Fila de Triagem',
          asideText: data?.length > 1 ? 'triagens' : 'triagem'
        }
      default:
        return {
          title: 'Fila de Atendimento',
          asideText: data?.length > 1 ? 'atendimentos' : 'atendimento'
        }
    }
  }, [user?.level, data?.length])

  const content = useMemo(() => {
    const isNurse = user?.level === UserLevels.NURSE

    if (loading) {
      return Array.from({ length: 8 }).map((_, i) => (
        <AttendanceItem key={i} loading={loading} />
      ))
    }

    if (data.length === 0)
      return (
        <Empty
          message={`Nenhum(a) ${isNurse ? 'triagem' : 'atendimento'} encontrado(a)`}
        />
      )

    return data.map((item) => (
      <AttendanceItem key={String(item._id)} item={item} />
    ))
  }, [loading, data, user?.level])

  const tvPortal =
    tvOpen &&
    createPortal(
      <div ref={tvRootRef} className={styles.tvShell}>
        <header className={styles.tvHeader}>
          <div>
            <h1 className={styles.tvTitle}>{cardConfig.title}</h1>
            <p className={styles.tvSubtitle}>
              {loading
                ? 'Carregando…'
                : `Painel público · atualização automática a cada ${TV_POLL_MS / 1000} s`}
            </p>
          </div>
          <div className={styles.tvHeaderActions}>
            <Button
              mode='outline'
              buttonHeight='2.5rem'
              onClick={() => void closeTv()}
            >
              Sair da tela cheia
            </Button>
          </div>
        </header>

        <div className={styles.tvBody}>
          <div className={styles.tvMainColumn}>
            <section className={styles.tvHero} aria-live='polite'>
              {loading ? (
                <div className={styles.tvHeroSkeleton}>
                  <span className={styles.skeletonTvBarWide} />
                  <span className={styles.skeletonTvBarHero} />
                  <span className={styles.skeletonTvBarMed} />
                </div>
              ) : tvBoard.hero ? (
                <>
                  <p className={styles.tvHeroCaption}>{tvBoard.hero.caption}</p>
                  <p className={styles.tvHeroTicket}>
                    {ticketLabel(tvBoard.hero.item)}
                  </p>
                  <p className={styles.tvHeroName}>
                    {tvBoard.hero.item.patientName}
                  </p>
                  {tvBoard.hero.sub ? (
                    <p className={styles.tvHeroSub}>{tvBoard.hero.sub}</p>
                  ) : null}
                  <div className={styles.tvHeroRisk}>
                    <RiskTag risk={tvBoard.hero.item.risk} />
                  </div>
                  {tvBoard.hero.item.complaint ? (
                    <p
                      className={styles.tvHeroComplaint}
                      title={tvBoard.hero.item.complaint}
                    >
                      {tvBoard.hero.item.complaint}
                    </p>
                  ) : null}
                </>
              ) : (
                <div className={styles.tvHeroEmpty}>
                  <p className={styles.tvHeroCaption}>Fila</p>
                  <p className={styles.tvHeroSub}>
                    Nenhum caso ativo na fila no momento
                  </p>
                </div>
              )}
            </section>

            <section className={styles.tvNextSection}>
              <h2 className={styles.tvPanelTitle}>Próximos</h2>
              {loading ? (
                <ul className={styles.tvMiniList}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className={styles.tvMiniRow}>
                      <span className={styles.skeletonTvBar} />
                    </li>
                  ))}
                </ul>
              ) : tvBoard.next.length === 0 ? (
                <p className={styles.tvPanelEmpty}>Sem próximos na fila</p>
              ) : (
                <ul className={styles.tvMiniList}>
                  {tvBoard.next.map((item) => (
                    <li key={String(item._id)} className={styles.tvMiniRow}>
                      <span className={styles.tvMiniTicket}>
                        {ticketLabel(item)}
                      </span>
                      <span className={styles.tvMiniName}>
                        {item.patientName}
                      </span>
                      <span className={styles.tvMiniMuted}>
                        {AttendanceStatusLabels[item.status]}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <aside className={styles.tvRecentAside}>
            <h2 className={styles.tvPanelTitleAccent}>Últimos concluídos</h2>
            {loading ? (
              <ul className={styles.tvMiniList}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className={styles.tvMiniRowRecent}>
                    <span className={styles.skeletonTvBar} />
                  </li>
                ))}
              </ul>
            ) : recentCompleted.length === 0 ? (
              <p className={styles.tvPanelEmpty}>
                {user?.unitId
                  ? 'Nenhum atendimento concluído hoje'
                  : 'Histórico disponível por unidade'}
              </p>
            ) : (
              <ul className={styles.tvMiniList}>
                {recentCompleted.map((item) => (
                  <li key={String(item._id)} className={styles.tvMiniRowRecent}>
                    <span className={styles.tvMiniTicketSmall}>
                      {item.number != null ? `#${item.number}` : '—'}
                    </span>
                    <span className={styles.tvRecentName}>
                      {item.patientName}
                    </span>
                    {item.complaint ? (
                      <span className={styles.tvRecentComplaint}>
                        {item.complaint}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>,
      document.body
    )

  return (
    <>
      {tvPortal}
      <DashboardCard
        title={cardConfig.title}
        icon={StethoscopeIcon}
        asideText={`${data?.length} ${cardConfig.asideText}`}
        gridArea='attendanceQueueChart'
        headerExtra={
          <Button mode='icon' onClick={openTv}>
            <ArrowsOutIcon size={22} />
          </Button>
        }
      >
        <div className={styles.queueList}>{content}</div>
      </DashboardCard>
    </>
  )
}

export default AttendanceQueueChart
