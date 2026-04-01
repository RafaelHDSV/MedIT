import { faker } from '@faker-js/faker'
import { Types } from 'mongoose'
import {
  AttendanceRisk,
  AttendanceStatus
} from '../../interfaces/IAttendance.js'
import { Attendance } from '../../models/AttendanceModel.js'
import { Doctor } from '../../models/DoctorModel.js'
import { Nurse } from '../../models/NurseModel.js'
import { Patient } from '../../models/PatientModel.js'
import { Unit } from '../../models/UnitModel.js'

const createAttendances = {
  name: 'create-attendances',
  description:
    'Cria atendimentos simulando um mês inteiro (ambiente produtivo)',
  async run() {
    console.log('🚀 Iniciando criação de atendimentos...')

    const patients = await Patient.find()
    const nurses = await Nurse.find()
    const doctors = await Doctor.find()
    const unit = await Unit.findOne()

    if (!patients.length || !nurses.length || !doctors.length || !unit) {
      console.log('❌ Dados insuficientes para gerar atendimentos')
      process.exit()
    }

    const attendances = []

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // total de dias no mês
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    // distribuição de risco (realista)
    const riskDistribution = [
      AttendanceRisk.NOT_URGENT,
      AttendanceRisk.NOT_URGENT,
      AttendanceRisk.LESS_URGENT,
      AttendanceRisk.LESS_URGENT,
      AttendanceRisk.URGENT,
      AttendanceRisk.VERY_URGENT,
      AttendanceRisk.EMERGENCY
    ]

    const complaints = [
      'Dor de cabeça',
      'Febre',
      'Dor abdominal',
      'Tosse persistente',
      'Falta de ar',
      'Dor no peito',
      'Tontura',
      'Vômito',
      'Dor muscular'
    ]

    const diagnoses = [
      'Virose',
      'Gripe',
      'Infecção leve',
      'Gastrite',
      'Ansiedade',
      'Hipertensão',
      'Bronquite'
    ]

    function randomVitalSigns() {
      return {
        bloodPressure: `${faker.number.int({ min: 10, max: 18 })}/${faker.number.int(
          { min: 6, max: 12 }
        )}`,
        heartRate: faker.number.int({ min: 60, max: 140 }),
        temperature: faker.number.float({
          min: 36,
          max: 40,
          fractionDigits: 1
        }),
        oxygenSaturation: faker.number.int({ min: 85, max: 100 })
      }
    }

    function getRandomStatus() {
      const statuses = Object.values(AttendanceStatus)
      return faker.helpers.arrayElement(statuses)
    }

    function generateHistory(status: AttendanceStatus, date: Date) {
      const history: Array<{ status: AttendanceStatus; changedAt: Date }> = [
        {
          status: AttendanceStatus.ON_THE_WAY,
          changedAt: new Date(date.getTime() - 1000 * 60 * 30)
        }
      ]

      if (status !== AttendanceStatus.ON_THE_WAY) {
        history.push({
          status: status,
          changedAt: date
        })
      }

      return history
    }

    // 🔥 Loop do mês inteiro
    for (let day = 1; day <= daysInMonth; day++) {
      // quantidade de atendimentos por dia (simulação realista)
      const attendancesPerDay = faker.number.int({ min: 80, max: 180 })

      for (let i = 0; i < attendancesPerDay; i++) {
        const hour = faker.number.int({ min: 0, max: 23 })
        const minute = faker.number.int({ min: 0, max: 59 })

        const date = new Date(currentYear, currentMonth, day, hour, minute)

        const risk = faker.helpers.arrayElement(riskDistribution)
        const status = getRandomStatus()

        const patient = faker.helpers.arrayElement(patients)
        const nurse = faker.helpers.arrayElement(nurses)
        const doctor = faker.helpers.arrayElement(doctors)

        const attendance = {
          complaint: faker.helpers.arrayElement(complaints),
          diagnosis:
            status === AttendanceStatus.ATTENDANCE_COMPLETED
              ? faker.helpers.arrayElement(diagnoses)
              : undefined,
          date,
          risk,
          status,
          unitId: unit._id,
          patientId: patient._id,
          nurseId: nurse._id,
          doctorId: doctor._id,
          medicationsIds: [],
          changesHistory: generateHistory(status, date),
          vitalSigns: randomVitalSigns(),
          iaConditionId: new Types.ObjectId()
        }

        attendances.push(attendance)
      }
    }

    console.log(`📦 Inserindo ${attendances.length} atendimentos...`)

    await Attendance.insertMany(attendances)

    console.log('✅ Atendimentos criados com sucesso!')
    process.exit()
  }
}

export default createAttendances
