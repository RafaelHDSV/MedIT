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
  UsersThreeIcon
} from '@phosphor-icons/react'
import { Flex } from 'antd'
import { useMemo } from 'react'
import styles from './Dashboard.module.scss'
import DashboardCard from './DashboardCard/DashboardCard'

function Dashboard() {
  const { user } = useAuth()
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
      nome: 'Rafael Silva',
      idade: 20,
      sintoma: 'Náusea',
      tempo: 'Aguard. há 2 horas',
      risco: 'Alto'
    },
    {
      nome: 'Matheus Takenaka',
      idade: 35,
      sintoma: 'Dor no peito',
      tempo: 'Aguard. há 2 horas',
      risco: 'Médio'
    },
    {
      nome: 'Rafael Vieira',
      idade: 48,
      sintoma: 'Febre',
      tempo: 'Aguard. há 2 horas',
      risco: 'Baixo'
    }
  ]

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

        <div className={styles.queue}>
          <div className={styles.queueHeader}>
            <h3>Fila de Atendimento</h3>
            <span>16 atendimentos</span>
          </div>

          {queueData.map((item, index) => {
            const iniciais = item.nome
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)

            return (
              <div key={index} className={styles.queueItem}>
                <div className={styles.avatar}>{iniciais}</div>

                <div className={styles.nome}>{item.nome}</div>

                <div className={styles.idade}>{item.idade} anos</div>

                <div className={styles.sintoma}>{item.sintoma}</div>

                <div className={styles.tempo}>{item.tempo}</div>

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

                <button className={styles.botao}>Iniciar Atendimento</button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
