import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { TagStatuses } from '@/components/Tag/Tag'
import UserDetailsCard from '@/components/UserDetailsCard/UserDetailsCard'
import UserDetailsHeader from '@/components/UserDetailsHeader/UserDetailsHeader'
import { handleApiError } from '@/helpers/handleApiError'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import { DoctorSpecializationsLabels, type IDoctor } from '@/interfaces/IDoctor'
import UserRepository from '@/repositories/UserRepository'
import capitalize from '@/utils/capitalize'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import {
  CalendarDotsIcon,
  ChartBarIcon,
  DatabaseIcon
} from '@phosphor-icons/react'
import { Flex } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DoctorModal from '../Doctors/components/DoctorModal/DoctorModal'
import styles from './DoctorDetails.module.scss'

// VIEIRA: Remover mock
const mockedLastAttendance = {
  patientComplaint: 'Febre e dores',
  suggestion: 'Dengue (87%)',
  medicalDefinition: 'Dengue ✅',
  attendanceTime: '20 min',
  date: '12/01/2025'
}

// VIEIRA: Corrigir tipagem any
// VIEIRA: Remover mock
const mockedAttendanceRecords: any[] = [
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Gripe',
    diagnosis: 'Consulta',
    date: new Date('2025-12-01'),
    risk: AttendanceRisk.NOT_URGENT
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Entorse',
    diagnosis: 'Emergência',
    date: new Date('2024-08-11'),
    risk: AttendanceRisk.EMERGENCY
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Check-up',
    diagnosis: 'Rotina',
    date: new Date('2024-06-15'),
    risk: AttendanceRisk.LESS_URGENT
  },
  {
    name: 'Maria Santos',
    birthDate: new Date('1986-10-15'),
    complaint: 'Alergia',
    diagnosis: 'Consulta',
    date: new Date('2024-03-22'),
    risk: AttendanceRisk.URGENT
  }
]

function DoctorDetails() {
  const params = useParams<{ id: string }>()
  const [doctor, setDoctor] = useState<IDoctor | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDoctorDetails = useCallback(async () => {
    setLoading(true)

    try {
      const response = await UserRepository.getDetails({ userId: params.id })
      setDoctor(response)
    } catch (err) {
      handleApiError(err, 'Erro ao carregar detalhes do médico(a)')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchDoctorDetails()
  }, [fetchDoctorDetails])

  return (
    <section>
      <AuthLayoutHeader
        actionComponent={
          <Flex gap='1rem'>
            <DoctorModal
              doctor={doctor}
              buttonText='Editar médico(a)'
              fetchDoctorDetails={fetchDoctorDetails}
            />

            <DeleteModal
              label='médico(a)'
              apiName='doctors'
              buttonText='Deletar médico(a)'
            />
          </Flex>
        }
      />

      <UserDetailsHeader
        name={doctor?.name}
        age={getAgeByBirthDate(doctor?.birthDate)}
        gender={doctor?.gender}
        statusTag={TagStatuses.WARNING}
        statusTagText='Em plantão'
        loading={loading}
      />

      <div className={styles.cards}>
        <UserDetailsCard
          Icon={DatabaseIcon}
          title='Dados Pessoais'
          itens={[
            { label: 'CPF', value: masks(doctor?.cpf, 'cpf') },
            {
              label: 'Telefone',
              value: masks(doctor?.cellphone, 'cellphone')
            },
            {
              label: 'Data de Nascimento',
              value: dayjs(doctor?.birthDate).format('DD/MM/YYYY')
            },
            {
              label: 'Especialidade',
              value:
                doctor?.specialization &&
                DoctorSpecializationsLabels[doctor.specialization]
                  ? DoctorSpecializationsLabels[doctor.specialization]
                  : capitalize(doctor?.specialization)
            },
            { label: 'CRM', value: doctor?.crm }
          ]}
          loading={loading}
        />
        <UserDetailsCard
          Icon={CalendarDotsIcon}
          title='Último Atendimento'
          itens={[
            {
              label: 'Queixa do Paciente',
              value: mockedLastAttendance.patientComplaint
            },
            { label: 'Sugestão IA', value: mockedLastAttendance.suggestion },
            {
              label: 'Definição Médica',
              value: mockedLastAttendance.medicalDefinition
            },
            {
              label: 'Tempo de Atendimento',
              value: mockedLastAttendance.attendanceTime
            },
            { label: 'Data', value: mockedLastAttendance.date }
          ]}
          loading={loading}
        />
        <UserDetailsCard
          Icon={ChartBarIcon}
          title='Histórico de Atendimentos'
          itens={mockedAttendanceRecords.map((item) => ({
            label: dayjs(item.date).format('DD/MM/YYYY'),
            value: `${item.diagnosis ?? ''} - ${item.complaint}`
          }))}
          loading={loading}
        />
      </div>
    </section>
  )
}

export default DoctorDetails
