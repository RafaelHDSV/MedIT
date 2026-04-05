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
    console.log('❌ Deletando os atendimentos já criados anteriormente')
    const deleted = await Attendance.deleteMany()
    console.log(`❌ Deletando ${deleted.deletedCount} atendimentos`)

    console.log('🚀 Criando atendimentos do ANO inteiro...')

    const units = await Unit.find()

    if (!units.length) {
      console.log('❌ Nenhuma unidade encontrada')
      process.exit()
    }

    // ------------------------------------------------------------------ //
    //  Pré-carrega usuários agrupados por unidade
    // ------------------------------------------------------------------ //
    type UnitPool = {
      unitId: Types.ObjectId
      patients: Types.ObjectId[]
      nurses: Types.ObjectId[]
      doctors: Types.ObjectId[]
    }

    const unitPools: UnitPool[] = []

    for (const unit of units) {
      const patients = await Patient.find({ unitId: unit._id })
        .select('_id')
        .lean<{ _id: Types.ObjectId }[]>()
      const nurses = await Nurse.find({ unitId: unit._id })
        .select('_id')
        .lean<{ _id: Types.ObjectId }[]>()
      const doctors = await Doctor.find({ unitId: unit._id })
        .select('_id')
        .lean<{ _id: Types.ObjectId }[]>()

      if (!patients.length || !nurses.length || !doctors.length) {
        console.warn(
          `⚠️  Unidade "${unit.name}" sem pacientes/enfermeiros/médicos suficientes — ignorada`
        )
        continue
      }

      unitPools.push({
        unitId: new Types.ObjectId(String(unit._id)),
        patients: patients.map((p) => p._id),
        nurses: nurses.map((n) => n._id),
        doctors: doctors.map((d) => d._id)
      })
    }

    if (!unitPools.length) {
      console.log(
        '❌ Nenhuma unidade com dados suficientes para gerar atendimentos'
      )
      process.exit()
    }

    console.log(`✅ ${unitPools.length} unidade(s) com dados válidos`)

    // ------------------------------------------------------------------ //
    //  Configurações
    // ------------------------------------------------------------------ //
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
        bloodPressure: `${faker.number.int({ min: 90, max: 180 })}/${faker.number.int({ min: 60, max: 110 })}`,
        heartRate: faker.number.int({ min: 60, max: 130 }),
        temperature: faker.number.float({
          min: 36,
          max: 39.5,
          fractionDigits: 1
        }),
        oxygenSaturation: faker.number.int({ min: 88, max: 100 })
      }
    }

    function generateStatusFlow(
      date: Date,
      risk: AttendanceRisk
    ): {
      status: AttendanceStatus
      history: { status: AttendanceStatus; changedAt: Date }[]
    } {
      const now = new Date()
      const diffMinutes = (now.getTime() - date.getTime()) / (1000 * 60)

      if (diffMinutes >= 0 && diffMinutes < 5) {
        return {
          status: AttendanceStatus.ON_THE_WAY,
          history: [{ status: AttendanceStatus.ON_THE_WAY, changedAt: date }]
        }
      }

      const flow: AttendanceStatus[] = [
        AttendanceStatus.ON_THE_WAY,
        AttendanceStatus.WAITING_TRIAGE,
        AttendanceStatus.IN_TRIAGE,
        AttendanceStatus.TRIAGE_COMPLETED,
        AttendanceStatus.WAITING_ATTENDANCE,
        AttendanceStatus.IN_ATTENDANCE,
        AttendanceStatus.ATTENDANCE_COMPLETED,
        AttendanceStatus.COMPLETED
      ]

      const timeMultiplier: Record<AttendanceRisk, number> = {
        [AttendanceRisk.EMERGENCY]: 5,
        [AttendanceRisk.VERY_URGENT]: 10,
        [AttendanceRisk.URGENT]: 15,
        [AttendanceRisk.LESS_URGENT]: 25,
        [AttendanceRisk.NOT_URGENT]: 40
      }

      const stepTime = timeMultiplier[risk] || 20

      if (diffMinutes > 180) {
        return {
          status: AttendanceStatus.COMPLETED,
          history: flow.map((status, i) => ({
            status,
            changedAt: new Date(date.getTime() + i * stepTime * 60000)
          }))
        }
      }

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

      return { status: flow[currentIndex], history }
    }

    function getAttendancesPerDay(date: Date, now: Date) {
      const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays > 200) return faker.number.int({ min: 70, max: 100 })
      if (diffDays > 100) return faker.number.int({ min: 90, max: 130 })
      if (diffDays > 30) return faker.number.int({ min: 110, max: 170 })
      return faker.number.int({ min: 150, max: 230 })
    }

    // ------------------------------------------------------------------ //
    //  Geração dos atendimentos
    // ------------------------------------------------------------------ //
    const now = new Date()
    const currentYear = now.getFullYear()
    const startDate = new Date(currentYear, 0, 1)
    const endDate = new Date(
      Math.min(new Date(currentYear, 11, 31).getTime(), now.getTime())
    )

    const activeStatuses: AttendanceStatus[] = [
      AttendanceStatus.WAITING_TRIAGE,
      AttendanceStatus.IN_TRIAGE,
      AttendanceStatus.TRIAGE_COMPLETED,
      AttendanceStatus.WAITING_ATTENDANCE,
      AttendanceStatus.IN_ATTENDANCE
    ]

    // Controla pacientes ativos por unidade (evita duplicidade em atendimentos simultâneos)
    const activePatientIdsByUnit = new Map<string, Set<string>>()
    for (const pool of unitPools) {
      activePatientIdsByUnit.set(pool.unitId.toString(), new Set())
    }

    // Índice round-robin para distribuir atendimentos igualmente entre unidades
    let unitPoolIndex = 0

    const attendances = []
    let attendanceNumber = 1
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const attendancesPerDay = getAttendancesPerDay(currentDate, now)

      for (let i = 0; i < attendancesPerDay; i++) {
        const hour = faker.number.int({ min: 6, max: 22 })
        const minute = faker.number.int({ min: 0, max: 59 })

        const date = new Date(currentDate)
        date.setHours(hour, minute)
        if (date > now) continue

        const risk = faker.helpers.arrayElement(riskDistribution)
        const { status, history } = generateStatusFlow(date, risk)
        const isActive = activeStatuses.includes(status)

        // Seleciona a unidade em round-robin
        const pool = unitPools[unitPoolIndex % unitPools.length]
        unitPoolIndex++

        const activeSet = activePatientIdsByUnit.get(pool.unitId.toString())!

        // Seleciona paciente respeitando ativos por unidade
        let patientId: Types.ObjectId | undefined
        if (isActive) {
          const available = pool.patients.filter(
            (id) => !activeSet.has(id.toString())
          )
          if (available.length === 0) continue
          patientId = faker.helpers.arrayElement(available)
          activeSet.add(patientId.toString())
        } else {
          patientId = faker.helpers.arrayElement(pool.patients)
        }

        const nurseId = faker.helpers.arrayElement(pool.nurses)
        const doctorId = faker.helpers.arrayElement(pool.doctors)

        const isFinished =
          status === AttendanceStatus.ATTENDANCE_COMPLETED ||
          status === AttendanceStatus.COMPLETED

        attendances.push({
          number: attendanceNumber++,
          complaint: faker.helpers.arrayElement(complaints),
          diagnosis: isFinished
            ? faker.helpers.arrayElement(diagnoses)
            : undefined,
          date,
          risk,
          status,
          unitId: pool.unitId,
          patientId,
          nurseId,
          doctorId:
            status !== AttendanceStatus.WAITING_TRIAGE ? doctorId : undefined,
          medicationsIds: [],
          changesHistory: history,
          vitalSigns: randomVitalSigns(),
          iaConditionId: new Types.ObjectId(),
          createdAt: date,
          updatedAt: date
        })
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    console.log(`📦 Inserindo ${attendances.length} atendimentos...`)

    await Attendance.insertMany(attendances, { timestamps: false })

    console.log('\n📊 Atendimentos por unidade:')
    for (const pool of unitPools) {
      const unit = units.find(
        (u) => u._id.toString() === pool.unitId.toString()
      )
      const count = attendances.filter(
        (a) => a.unitId.toString() === pool.unitId.toString()
      ).length
      console.log(`   ${unit?.name}: ${count} atendimento(s)`)
    }

    console.log('\n✅ Ano completo gerado com sucesso!')
    process.exit()
  }
}

export default createAttendances
