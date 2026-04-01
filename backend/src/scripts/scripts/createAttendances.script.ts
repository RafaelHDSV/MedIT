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
  description: 'Simulação de 1 ano de atendimentos',

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

    const startDate = new Date(currentYear, 0, 1) // 01/01
    const endDate = new Date(currentYear, 11, 31) // 31/12

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
      'Dor no peito'
    ]

    const diagnoses = ['Virose', 'Gripe', 'Infecção leve', 'Gastrite']

    function randomVitalSigns() {
      return {
        bloodPressure: `${faker.number.int({ min: 10, max: 18 })}/${faker.number.int(
          { min: 6, max: 12 }
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

    function getStatusByTime(date: Date): AttendanceStatus {
      const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60)

      if (diffMinutes < 0) return AttendanceStatus.ON_THE_WAY
      if (diffMinutes > 120) return AttendanceStatus.ATTENDANCE_COMPLETED
      if (diffMinutes > 30) return AttendanceStatus.IN_ATTENDANCE

      return AttendanceStatus.WAITING_TRIAGE
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
        const hour = faker.number.int({ min: 0, max: 23 })
        const minute = faker.number.int({ min: 0, max: 59 })

        const date = new Date(currentDate)
        date.setHours(hour, minute)

        const risk = faker.helpers.arrayElement(riskDistribution)
        const status = getStatusByTime(date)

        const patient = faker.helpers.arrayElement(patients)
        const nurse = faker.helpers.arrayElement(nurses)
        const doctor = faker.helpers.arrayElement(doctors)

        const isFinished = status === AttendanceStatus.ATTENDANCE_COMPLETED

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
          doctorId: isFinished ? doctor._id : undefined,
          medicationsIds: [],
          changesHistory: [
            {
              status: AttendanceStatus.ON_THE_WAY,
              changedAt: new Date(date.getTime() - 1000 * 60 * 30)
            },
            {
              status,
              changedAt: date
            }
          ],
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
