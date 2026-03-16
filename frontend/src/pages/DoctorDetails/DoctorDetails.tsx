import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import UserBall from '@/components/UserBall/UserBall'
import type { IAttendance } from '@/interfaces/IAttendance'
import {
  UserGender,
  UserGendersLabels,
  UserRoles,
  type IUser
} from '@/interfaces/IUser'
import { CalendarDotsIcon, ChartBarIcon } from '@phosphor-icons/react'
import styles from './DoctorDetails.module.scss'

const mockedDoctor: IUser = {
  name: 'Fernando Luís',
  cpf: '328.189.110-10',
  role: UserRoles.DOCTOR,
  email: 'fernando.luis@example.com',
  password: 'password123',
  age: 58,
  gender: UserGender.MALE,
  cellphone: 15999991234,
  birthDate: new Date('1968-09-15'),
  crm: '117101',
  specialization: 'Pediatria'
}

const mockedAttendance: IAttendance[] = [
  { type: 'Consulta', description: 'Gripe', date: new Date('01/12/2025') },
  { type: 'Emergência', description: 'Entorse', date: new Date('11/08/2024') },
  { type: 'Rotina', description: 'Check-up', date: new Date('06/15/2024') },
  { type: 'Consulta', description: 'Alergia', date: new Date('03/22/2024') }
]

function DoctorDetails() {
  return (
    <div className={styles.container}>
      <AuthLayoutHeader />

      <header className={styles.header}>
        <UserBall name={mockedDoctor.name} size={64} fontSize={26} />

        <div className={styles.doctorInfo}>
          <h2>{mockedDoctor.name}</h2>

          <p>
            <span>{mockedDoctor.age} anos</span>
            <span className={styles.separator}>•</span>
            <span>
              {mockedDoctor.gender && UserGendersLabels[mockedDoctor.gender]}
            </span>
          </p>
        </div>

        <div className={styles.status}>
          <span>Em plantão</span>
        </div>
      </header>

      <div className={styles.cards}>
        <section className={styles.card}>
          <h3>Dados Pessoais</h3>

          <div>
            <span>CPF</span>
            <span>{mockedDoctor.cpf}</span>
          </div>

          <div>
            <span>CRM</span>
            <span>{mockedDoctor.crm}</span>
          </div>

          <div>
            <span>Especialidade</span>
            <span>{mockedDoctor.specialization}</span>
          </div>

          <div>
            <span>Telefone</span>
            <span>{mockedDoctor.cellphone}</span>
          </div>

          <div>
            <span>Data de Nascimento</span>
            <span>{mockedDoctor.birthDate?.toLocaleDateString()}</span>
          </div>
        </section>

        <section className={styles.card}>
          <h3>
            <CalendarDotsIcon size={22} />
            Último Atendimento
          </h3>

          <div>
            <span>Queixa do Paciente</span>
            <span>Febre e dores</span>
          </div>

          <div>
            <span>Sugestão IA</span>
            <span>Dengue (87%)</span>
          </div>

          <div>
            <span>Definição Médica</span>
            <span>Dengue ✅</span>
          </div>

          <div>
            <span>Tempo de Atendimento</span>
            <span>20 min</span>
          </div>

          <div>
            <span>Data</span>
            <span>12/01/2025</span>
          </div>
        </section>

        <section className={`${styles.card} ${styles.history}`}>
          <h3>
            <ChartBarIcon size={22} />
            Histórico de Atendimentos
          </h3>

          <ul>
            {mockedAttendance.map((item, index) => (
              <li key={index}>
                <span className={styles.date}>
                  {item.date.toLocaleDateString()}
                </span>

                <span className={styles.description}>
                  {item.type} - {item.description}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default DoctorDetails
