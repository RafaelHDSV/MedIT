import Button from '@/components/Button/Button'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import { AttendanceStatusLabels } from '@/interfaces/IAttendance'
import type {
  IDashboardQueueItem,
  IDashboardRecentCompletedItem
} from '@/interfaces/IDashboard'
import type { IAuthUser } from '@/interfaces/IUser'
import { createPortal } from 'react-dom'
import styles from './AttendanceQueueTvPortal.module.scss'

function ticketLabel(item: IDashboardQueueItem) {
  return item.dailyNumber != null ? String(item.dailyNumber) : '—'
}

interface ITvPortalProps {
  open: boolean
  close: () => void
  loading: boolean
  cardConfig: {
    title: string
    asideText: string
  }
  user: IAuthUser | null
  board: {
    hero: {
      caption: string
      item: IDashboardQueueItem
      sub: string
    } | null
    next: IDashboardQueueItem[]
  }
  rootRef: React.RefObject<HTMLDivElement | null>
  recentCompleted: IDashboardRecentCompletedItem[]
  TV_POLL_MS: number
}

function tvPortal({
  open,
  close,
  loading,
  cardConfig,
  user,
  board,
  rootRef,
  recentCompleted,
  TV_POLL_MS
}: ITvPortalProps) {
  return (
    open &&
    createPortal(
      <div ref={rootRef} className={styles.tvShell}>
        <header className={styles.tvHeader}>
          <div>
            <h1 className={styles.tvTitle}>{cardConfig.title}</h1>
            <p className={styles.tvSubtitle}>
              {loading
                ? 'Carregando…'
                : `Painel público · atualização automática a cada ${TV_POLL_MS / 1000}s`}
            </p>
          </div>
          <div className={styles.tvHeaderActions}>
            <Button
              mode='outline'
              buttonHeight='2.5rem'
              onClick={() => void close()}
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
              ) : board.hero ? (
                <>
                  <p className={styles.tvHeroCaption}>{board.hero.caption}</p>
                  <p className={styles.tvHeroTicket}>
                    {ticketLabel(board.hero.item)}
                  </p>
                  <p className={styles.tvHeroName}>
                    {board.hero.item.patientName}
                  </p>
                  {board.hero.sub ? (
                    <p className={styles.tvHeroSub}>{board.hero.sub}</p>
                  ) : null}
                  <div className={styles.tvHeroRisk}>
                    <RiskTag risk={board.hero.item.risk} />
                  </div>
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
              ) : board.next.length === 0 ? (
                <p className={styles.tvPanelEmpty}>Sem próximos na fila</p>
              ) : (
                <ul className={styles.tvMiniList}>
                  {board.next.map((item) => (
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
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>,
      document.body
    )
  )
}

export default tvPortal
