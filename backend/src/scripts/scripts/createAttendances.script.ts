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
  description: 'Simulação de 1 ano de atendimentos (realista)',

  async run() {
    console.log('🚀 Criando atendimentos do ANO inteiro...')

    const patients = await Patient.find()
    const nurses = await Nurse.find()
    const doctors = await Doctor.find()
    const unit = await Unit.findOne()

    if (!patients.length || !nurses.length || !doctors.length || !unit) {
      console.log('❌ Dados insuficientes')
      process.exit()
    }

    const attendances = []

    const now = new Date()
    const currentYear = now.getFullYear()

    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(currentYear, 11, 31)

    const riskDistribution = [
      AttendanceRisk.NOT_URGENT,
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
      'Dor no peito'
    ]

    const diagnoses = ['Virose', 'Gripe', 'Infecção leve', 'Gastrite']

    function randomVitalSigns() {
      return {
        bloodPressure: `${faker.number.int({ min: 90, max: 180 })}/${faker.number.int(
          { min: 60, max: 110 }
        )}`,
        heartRate: faker.number.int({ min: 60, max: 130 }),
        temperature: faker.number.float({
          min: 36,
          max: 39.5,
          fractionDigits: 1
        }),
        oxygenSaturation: faker.number.int({ min: 88, max: 100 })
      }
    }

    function generateStatusFlow(date: Date, risk: AttendanceRisk) {
      const now = new Date()
      const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60)

      if (diffMinutes >= 0 && diffMinutes < 5) {
        return {
          status: AttendanceStatus.ON_THE_WAY,
          history: [
            {
              status: AttendanceStatus.ON_THE_WAY,
              changedAt: date
            }
          ]
        }
      }

      const flow = [
        AttendanceStatus.ON_THE_WAY,
        AttendanceStatus.WAITING_TRIAGE,
        AttendanceStatus.IN_TRIAGE,
        AttendanceStatus.TRIAGE_COMPLETED,
        AttendanceStatus.WAITING_ATTENDANCE,
        AttendanceStatus.IN_ATTENDANCE,
        AttendanceStatus.ATTENDANCE_COMPLETED,
        AttendanceStatus.COMPLETED
      ]

      const timeMultiplier = {
        [AttendanceRisk.EMERGENCY]: 5,
        [AttendanceRisk.VERY_URGENT]: 10,
        [AttendanceRisk.URGENT]: 15,
        [AttendanceRisk.LESS_URGENT]: 25,
        [AttendanceRisk.NOT_URGENT]: 40
      }

      if (diffMinutes > 180) {
        return {
          status: AttendanceStatus.COMPLETED,
          history: flow.map((status, i) => ({
            status,
            changedAt: new Date(date.getTime() + i * stepTime * 60000)
          }))
        }
      }

      const stepTime = timeMultiplier[risk] || 20

      const currentIndex = Math.min(
        Math.floor(diffMinutes / stepTime),
        flow.length - 1
      )

      const history = []

      for (let i = 0; i <= currentIndex; i++) {
        history.push({
          status: flow[i],
          changedAt: new Date(date.getTime() + i * stepTime * 60 * 1000)
        })
      }

      return {
        status: flow[currentIndex],
        history
      }
    }

    function getAttendancesPerDay(date: Date) {
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)

      if (diffDays > 200) return faker.number.int({ min: 20, max: 50 })
      if (diffDays > 100) return faker.number.int({ min: 40, max: 80 })
      if (diffDays > 30) return faker.number.int({ min: 60, max: 120 })

      return faker.number.int({ min: 100, max: 180 })
    }

    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const attendancesPerDay = getAttendancesPerDay(currentDate)

      for (let i = 0; i < attendancesPerDay; i++) {
        const hour = faker.number.int({ min: 6, max: 22 })
        const minute = faker.number.int({ min: 0, max: 59 })

        const date = new Date(currentDate)
        date.setHours(hour, minute)

        const risk = faker.helpers.arrayElement(riskDistribution)

        const { status, history } = generateStatusFlow(date, risk)

        const patient = faker.helpers.arrayElement(patients)
        const nurse = faker.helpers.arrayElement(nurses)
        const doctor = faker.helpers.arrayElement(doctors)

        const isFinished =
          status === AttendanceStatus.ATTENDANCE_COMPLETED ||
          status === AttendanceStatus.COMPLETED

        attendances.push({
          complaint: faker.helpers.arrayElement(complaints),
          diagnosis: isFinished
            ? faker.helpers.arrayElement(diagnoses)
            : undefined,
          date,
          risk,
          status,
          unitId: unit._id,
          patientId: patient._id,
          nurseId: nurse._id,
          doctorId:
            status !== AttendanceStatus.WAITING_TRIAGE ? doctor._id : undefined,
          medicationsIds: [],
          changesHistory: history,
          vitalSigns: randomVitalSigns(),
          iaConditionId: new Types.ObjectId()
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    console.log(`📦 Inserindo ${attendances.length} atendimentos...`)

    await Attendance.insertMany(attendances)

    console.log('✅ Ano completo gerado com sucesso!')
    process.exit()
  }
}

export default createAttendances
