import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import {
  BedIcon,
  BombIcon,
  CheckCircleIcon,
  DoorOpenIcon,
  HourglassIcon,
  TimerIcon,
  UsersThreeIcon,
  StethoscopeIcon
} from '@phosphor-icons/react'
import { Flex } from 'antd'
import { useMemo, useState } from 'react'
import styles from './Dashboard.module.scss'
import DashboardCard from './DashboardCard/DashboardCard'

function Dashboard() {
  const { user } = useAuth()
  const [showAll, setShowAll] = useState(false)
  const cardsData = useMemo(() => {
    switch (user?.level) {
      case UserLevels.ADMIN:
        return [
          { Icon: DoorOpenIcon, value: '142', label: 'Entradas' },
          { Icon: HourglassIcon, value: '46', label: 'Em atendimento' },
          { Icon: CheckCircleIcon, value: '96', label: 'Atendidos' },
          { Icon: BedIcon, value: '52%', label: 'Ocupação' },
          { Icon: TimerIcon, value: '23min', label: 'Tempo médio' },
          { Icon: BombIcon, value: '8', label: 'Risco alto' }
        ]
      case UserLevels.DOCTOR:
        return [
          { Icon: HourglassIcon, value: '14', label: 'Pacientes aguardando' },
          {
            Icon: CheckCircleIcon,
            value: '96',
            label: 'Atendimentos realizados'
          },
          { Icon: TimerIcon, value: '18min', label: 'Tempo médio' },
          {
            Icon: UsersThreeIcon,
            value: '52%',
            label: 'Assertividade IA vs Médico'
          }
        ]
      case UserLevels.NURSE:
        return [
          { Icon: HourglassIcon, value: '25', label: 'Pacientes aguardando' },
          {
            Icon: CheckCircleIcon,
            value: '96',
            label: 'Pacientes triados hoje'
          },
          { Icon: TimerIcon, value: '18min', label: 'Tempo médio' }
        ]
      case UserLevels.PATIENT:
        return []
      default:
        return []
    }
  }, [user?.level])
  const queueData = [
    {
      nome: 'Rafael Vieira',
      status: 'Aguardando Médico',
      risco: 'Baixo'
    },
    {
      nome: 'Rafael Silva',
      status: 'Aguardando Médico',
      risco: 'Alto'
    },
    {
      nome: 'Rafael Vieira',
      status: 'Aguardando Médico',
      risco: 'Baixo'
    },
    {
      nome: 'Rafael Vieira',
      status: 'Aguardando Médico',
      risco: 'Baixo'
    },
    {
      nome: 'Matheus Takenaka',
      status: 'Aguardando Médico',
      risco: 'Médio'
    },
    {
      nome: 'Matheus Takenaka',
      status: 'Aguardando Médico',
      risco: 'Médio'
    },
    {
      nome: 'Rafael Silva',
      status: 'Aguardando Médico',
      risco: 'Alto'
    },
    {
      nome: 'Rafael Vieira',
      status: 'Aguardando Médico',
      risco: 'Baixo'
    },
    {
      nome: 'Matheus Takenaka',
      status: 'Aguardando Médico',
      risco: 'Médio'
    }
  ]
  const attendanceData = [
    { hora: '17h', valor: 40 },
    { hora: '18h', valor: 25 },
    { hora: '19h', valor: 30 },
    { hora: '20h', valor: 60 },
    { hora: '21h', valor: 80 },
    { hora: '22h', valor: 100 },
    { hora: '23h', valor: 90 },
    { hora: '00h', valor: 20 }
  ]

  const visibleQueue = showAll ? queueData : queueData.slice(0, 5)

  return (
    <section>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.NOT_STARTED} />
      </Flex>

      <div className={styles.cardsContainer}>
        {cardsData.map(({ Icon, value, label }) => (
          <DashboardCard key={label} Icon={Icon} value={value} label={label} />
        ))}

        <div className={styles.attendance}>
          <div className={styles.attendanceHeader}>
            <h3>Atendimentos por Hora</h3>
            <div>
              <span>
                <TimerIcon />
              </span>
              <span> 30 p/ hora</span>
            </div>
          </div>

          <div className={styles.chart}>
            {attendanceData.map((item, index) => (
              <div key={index} className={styles.barContainer}>
                <div className={styles.bar} style={{ height: item.valor }} />
                <span className={styles.label}>{item.hora}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.queue}>
          <div className={styles.queueHeader}>
            <h3>Fila de Atendimento</h3>
            <div className={styles.queueInfo}>
              <span>
                <StethoscopeIcon />
              </span>
              <span> {queueData.length} atendimentos</span>
            </div>
          </div>

          {visibleQueue.map((item, index) => {
            const iniciais = item.nome
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)

            return (
              <div key={index} className={styles.queueItem}>
                <div className={styles.left}>
                  <div
                    className={`${styles.avatar} ${
                      item.risco === 'Alto'
                        ? styles.avatarAlto
                        : item.risco === 'Médio'
                          ? styles.avatarMedio
                          : styles.avatarBaixo
                    }`}
                  >
                    {iniciais}
                  </div>

                  <div className={styles.info}>
                    <span className={styles.nome}>{item.nome}</span>
                    <span className={styles.status}>{item.status}</span>
                  </div>
                </div>
                <div
                  className={`${styles.risco} ${
                    item.risco === 'Alto'
                      ? styles.alto
                      : item.risco === 'Médio'
                        ? styles.medio
                        : styles.baixo
                  }`}
                >
                  {item.risco}
                </div>
              </div>
            )
          })}
          {queueData.length > 5 && (
            <div className={styles.more} onClick={() => setShowAll(!showAll)}>
              {showAll
                ? 'Mostrar menos'
                : `+ ${queueData.length - 5} atendimentos`}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
export default Dashboard
