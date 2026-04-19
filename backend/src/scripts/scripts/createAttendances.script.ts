import { faker } from '@faker-js/faker'
import { Types } from 'mongoose'
import {
  AttendanceRisk,
  AttendanceStatus
} from '../../interfaces/IAttendance.js'
import { BloodType } from '../../interfaces/IPatient.js'
import { Attendance } from '../../models/AttendanceModel.js'
import { Doctor } from '../../models/DoctorModel.js'
import { Nurse } from '../../models/NurseModel.js'
import { Patient } from '../../models/PatientModel.js'
import { Unit } from '../../models/UnitModel.js'

/** Janela: hoje − 364 dias até agora (≈ 1 ano rolante). */
const DAYS_BACK = 364

const MIN_COMPLETED_PER_PATIENT = 5
const MIN_COMPLETED_PER_DOCTOR = 5
const MIN_COMPLETED_PER_NURSE = 5
const MIN_ACTIVE_PER_DOCTOR = 2
const MIN_ACTIVE_PER_NURSE = 2

/** Lotes pequenos para Atlas free / memória estável. */
const INSERT_BATCH_SIZE = 400

/** Extras aleatórios por unidade (fase 5), além dos mínimos e da série diária. */
const MAX_RANDOM_EXTRA_PER_UNIT = 2200

/** Meta mínima global (após série diária ainda pode haver top-up em lotes). */
const TARGET_MIN_TOTAL_ATTENDANCES = 37_500

/** Teto de segurança para não estourar cluster free acidentalmente. */
const ABSOLUTE_MAX_TOTAL_ATTENDANCES = 180_000

/** Máximo de lotes extras no top-up (400 × 400 = 160k teto teórico). */
const MAX_TOP_UP_BATCHES = 450

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
  'Dor no peito',
  'Náusea',
  'Tontura',
  'Dor lombar',
  'Coriza e espirros',
  'Dor de garganta',
  'Palpitação',
  'Dor no joelho',
  'Ardor ao urinar',
  'Diarreia'
]

const diagnoses = [
  'Virose',
  'Gripe',
  'Infecção leve',
  'Gastrite',
  'Sinusite',
  'Lombalgia',
  'Cefaleia tensional',
  'Faringite',
  'ITU não complicada',
  'Exacerbação de asma leve'
]

const COMPLETED_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.ATTENDANCE_COMPLETED,
  AttendanceStatus.COMPLETED
]

const ACTIVE_STATUSES: AttendanceStatus[] = [
  AttendanceStatus.ON_THE_WAY,
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE
]

const FULL_FLOW: AttendanceStatus[] = [
  AttendanceStatus.ON_THE_WAY,
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE,
  AttendanceStatus.ATTENDANCE_COMPLETED,
  AttendanceStatus.COMPLETED
]

type UnitPool = {
  unitId: Types.ObjectId
  patients: Types.ObjectId[]
  nurses: Types.ObjectId[]
  doctors: Types.ObjectId[]
}

type AttendanceSeed = {
  number: number
  complaint: string
  diagnosis?: string
  date: Date
  risk: AttendanceRisk
  status: AttendanceStatus
  unitId: Types.ObjectId
  patientId: Types.ObjectId
  nurseId?: Types.ObjectId
  doctorId?: Types.ObjectId
  medicationsIds: Types.ObjectId[]
  changesHistory: { status: AttendanceStatus; changedAt: Date }[]
  vitalSigns: ReturnType<typeof randomVitalSigns>
  iaConditionId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  painLevel?: number
  selfMedicated?: boolean
  symptoms?: string[]
  generalObservation?: string
}

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

function riskStepMinutes(risk: AttendanceRisk): number {
  const timeMultiplier: Record<AttendanceRisk, number> = {
    [AttendanceRisk.EMERGENCY]: 5,
    [AttendanceRisk.VERY_URGENT]: 10,
    [AttendanceRisk.URGENT]: 15,
    [AttendanceRisk.LESS_URGENT]: 25,
    [AttendanceRisk.NOT_URGENT]: 40
  }
  return timeMultiplier[risk] ?? 20
}

function buildCompletedFlow(
  startedAt: Date,
  risk: AttendanceRisk
): { status: AttendanceStatus; history: { status: AttendanceStatus; changedAt: Date }[] } {
  const stepMs = riskStepMinutes(risk) * 60_000
  return {
    status: AttendanceStatus.COMPLETED,
    history: FULL_FLOW.map((status, i) => ({
      status,
      changedAt: new Date(startedAt.getTime() + i * stepMs)
    }))
  }
}

/** Histórico coerente até um status “ativo” (pendente / em andamento). */
function buildActiveFlow(
  startedAt: Date,
  risk: AttendanceRisk,
  targetStatus: AttendanceStatus
): { status: AttendanceStatus; history: { status: AttendanceStatus; changedAt: Date }[] } {
  const idx = FULL_FLOW.indexOf(targetStatus)
  const lastIdx = idx >= 0 ? idx : FULL_FLOW.indexOf(AttendanceStatus.IN_ATTENDANCE)
  const stepMs = riskStepMinutes(risk) * 60_000
  const slice = FULL_FLOW.slice(0, lastIdx + 1)
  return {
    status: slice[slice.length - 1],
    history: slice.map((status, i) => ({
      status,
      changedAt: new Date(startedAt.getTime() + i * stepMs)
    }))
  }
}

function windowBounds(now: Date): { start: Date; end: Date } {
  const end = new Date(now)
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - DAYS_BACK)
  return { start, end: end }
}

/** Início do atendimento concluído: cabe o fluxo inteiro antes de `min(end, agora)`. */
function randomCompletedStartInWindow(
  windowStart: Date,
  windowEnd: Date,
  risk: AttendanceRisk
): Date {
  const stepMs = riskStepMinutes(risk) * 60_000
  const flowSpan = (FULL_FLOW.length - 1) * stepMs
  const endCap =
    Math.min(windowEnd.getTime(), Date.now()) - flowSpan - 5 * 60_000
  const startMs = windowStart.getTime()
  if (endCap <= startMs) {
    return new Date(startMs + 60_000)
  }
  return new Date(
    faker.number.int({ min: Math.floor(startMs), max: Math.floor(endCap) })
  )
}

/** Concluído com `date` caindo no dia civil `dayStart` (00h local). */
function randomCompletedStartOnCalendarDay(
  dayStart: Date,
  windowEnd: Date,
  risk: AttendanceRisk
): Date {
  const stepMs = riskStepMinutes(risk) * 60_000
  const flowSpan = (FULL_FLOW.length - 1) * stepMs
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)
  const endCap =
    Math.min(dayEnd.getTime(), windowEnd.getTime(), Date.now()) -
    flowSpan -
    60_000
  const startMs = dayStart.getTime()
  if (endCap <= startMs) {
    return new Date(startMs + 60_000)
  }
  return new Date(
    faker.number.int({ min: Math.floor(startMs), max: Math.floor(endCap) })
  )
}

/** Volume do dia: menos fim de semana; leve sazonalidade e porte da unidade. */
function attendancesForCalendarDay(
  pool: UnitPool,
  day: Date,
  windowStart: Date
): number {
  const dow = day.getDay()
  const isWeekend = dow === 0 || dow === 6
  const month = day.getMonth()
  /** Inverno (BR): jun–ago → mais demanda respiratória */
  const winterBoost = month >= 5 && month <= 7 ? 2 : 0
  const daysSinceStart = Math.max(
    0,
    (day.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24)
  )
  /** Mais recente: fila maior */
  const recencyBoost =
    daysSinceStart > 300 ? 0 : daysSinceStart > 180 ? 1 : daysSinceStart > 60 ? 2 : 3

  const staffBoost = Math.min(
    5,
    Math.floor(
      (pool.patients.length + pool.doctors.length * 4 + pool.nurses.length * 3) /
        100
    )
  )

  if (isWeekend) {
    return faker.number.int({
      min: 5 + winterBoost + staffBoost,
      max: 13 + winterBoost + staffBoost + recencyBoost
    })
  }
  return faker.number.int({
    min: 10 + winterBoost + staffBoost,
    max: 26 + winterBoost + staffBoost + recencyBoost
  })
}

function maybeClinicalExtras(): Pick<
  AttendanceSeed,
  'painLevel' | 'selfMedicated' | 'symptoms' | 'generalObservation'
> {
  if (!faker.datatype.boolean({ probability: 0.4 })) return {}
  const symptomsPool = [
    'Febre baixa',
    'Calafrios',
    'Mal-estar',
    'Coriza',
    'Tosse seca',
    'Dor ao urinar',
    'Inapetência'
  ]
  return {
    painLevel: faker.number.int({ min: 0, max: 10 }),
    selfMedicated: faker.datatype.boolean(),
    symptoms: faker.helpers.arrayElements(symptomsPool, {
      min: 1,
      max: 3
    }),
    generalObservation: faker.datatype.boolean()
      ? faker.helpers.arrayElement([
          'Paciente orientado e cooperativo.',
          'Histórico sem alergias medicamentosas relevantes.',
          'Sinais vitais estáveis na chegada.',
          'Relato de evolução há 2–3 dias.'
        ])
      : undefined
  }
}

/** Status onde o médico já está vinculado (≠ waitingTriage no seed). */
function pickActiveTargetStatus(): AttendanceStatus {
  return faker.helpers.arrayElement([
    AttendanceStatus.IN_TRIAGE,
    AttendanceStatus.TRIAGE_COMPLETED,
    AttendanceStatus.WAITING_ATTENDANCE,
    AttendanceStatus.IN_ATTENDANCE
  ])
}

async function insertBatched(docs: AttendanceSeed[]) {
  for (let i = 0; i < docs.length; i += INSERT_BATCH_SIZE) {
    const chunk = docs.slice(i, i + INSERT_BATCH_SIZE)
    await Attendance.insertMany(chunk, { ordered: false, timestamps: false })
  }
}

async function ensurePatients(
  pool: UnitPool,
  minCount: number
): Promise<void> {
  while (pool.patients.length < minCount) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const cpf = faker.string.numeric(11)
    const created = (await Patient.create({
      name: `${firstName} ${lastName}`,
      cpf,
      email: faker.internet.email({
        firstName,
        lastName,
        provider: 'seed.med.br'
      }),
      password: 'fastpass',
      gender: faker.helpers.arrayElement(['male', 'female']),
      birthDate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
      cellphone: Number(faker.string.numeric(11)),
      unitId: pool.unitId.toString(),
      weight: faker.number.float({ min: 50, max: 120, fractionDigits: 1 }),
      height: faker.number.float({ min: 1.5, max: 2.0, fractionDigits: 2 }),
      bloodType: faker.helpers.arrayElement(Object.values(BloodType)),
      conditions: [],
      allergies: []
    } as never)) as { _id: Types.ObjectId }
    pool.patients.push(new Types.ObjectId(String(created._id)))
    console.log(
      `   ➕ Paciente extra criado na unidade ${pool.unitId} (pool mínimo)`
    )
  }
}

function seedDoc(
  args: Omit<AttendanceSeed, 'medicationsIds' | 'iaConditionId'> & {
    medicationsIds?: Types.ObjectId[]
    iaConditionId?: Types.ObjectId
  } & Partial<
    Pick<
      AttendanceSeed,
      'painLevel' | 'selfMedicated' | 'symptoms' | 'generalObservation'
    >
  >
): AttendanceSeed {
  return {
    ...args,
    medicationsIds: args.medicationsIds ?? [],
    iaConditionId: args.iaConditionId ?? new Types.ObjectId()
  }
}

function seedCompleted(
  args: Omit<AttendanceSeed, 'medicationsIds' | 'iaConditionId'> & {
    medicationsIds?: Types.ObjectId[]
    iaConditionId?: Types.ObjectId
  }
): AttendanceSeed {
  return seedDoc({ ...args, ...maybeClinicalExtras() })
}

const createAttendances = {
  name: 'create-attendances',
  description:
    'Ano rolante (364d): mínimos por papel + série diária realista + top-up ≥37,5k; lotes',
  async run() {
    console.log('❌ Removendo atendimentos existentes…')
    const deleted = await Attendance.deleteMany()
    console.log(`   ${deleted.deletedCount} documento(s) removido(s)`)

    const now = new Date()
    const { start: windowStart, end: windowEnd } = windowBounds(now)
    console.log(
      `📅 Janela: ${windowStart.toISOString().slice(0, 10)} → ${windowEnd.toISOString().slice(0, 10)} (~${DAYS_BACK + 1} dias)`
    )

    const units = await Unit.find()
    if (!units.length) {
      console.log('❌ Nenhuma unidade encontrada')
      process.exit(1)
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
          `⚠️  Unidade "${unit.name}" sem pacientes/enfermeiros/médicos — ignorada`
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
      console.log('❌ Nenhuma unidade com dados suficientes')
      process.exit(1)
    }

    console.log(`✅ ${unitPools.length} unidade(s) válida(s)\n`)

    let attendanceNumber = 1

    for (const pool of unitPools) {
      console.log(`🏥 Unidade ${pool.unitId}`)
      const unitDocs: AttendanceSeed[] = []

      const D = pool.doctors.length
      const N = pool.nurses.length
      const P = pool.patients.length

      const activeRowsNeeded = Math.max(
        MIN_ACTIVE_PER_DOCTOR * D,
        MIN_ACTIVE_PER_NURSE * N
      )
      const minPatientsForActive = activeRowsNeeded
      if (P < minPatientsForActive) {
        console.log(
          `   Ajustando pool de pacientes (${P} → ≥${minPatientsForActive} para ativos distintos)`
        )
        await ensurePatients(pool, minPatientsForActive)
      }

      const pickDoctor = () =>
        faker.helpers.arrayElement(pool.doctors) as Types.ObjectId
      const pickNurse = () =>
        faker.helpers.arrayElement(pool.nurses) as Types.ObjectId

      // --- Fase 1: ≥5 concluídos por paciente ---
      for (const patientId of pool.patients) {
        for (let k = 0; k < MIN_COMPLETED_PER_PATIENT; k++) {
          const risk = faker.helpers.arrayElement(riskDistribution)
          const date = randomCompletedStartInWindow(windowStart, windowEnd, risk)
          const nurseId = pickNurse()
          const doctorId = pickDoctor()
          const { status, history } = buildCompletedFlow(date, risk)
          unitDocs.push(
            seedCompleted({
              number: attendanceNumber++,
              complaint: faker.helpers.arrayElement(complaints),
              diagnosis: faker.helpers.arrayElement(diagnoses),
              date,
              risk,
              status,
              unitId: pool.unitId,
              patientId,
              nurseId,
              doctorId,
              changesHistory: history,
              vitalSigns: randomVitalSigns(),
              createdAt: date,
              updatedAt: date
            })
          )
        }
      }

      const countCompletedForDoctor = (id: Types.ObjectId) =>
        unitDocs.filter(
          (a) =>
            a.doctorId?.toString() === id.toString() &&
            COMPLETED_STATUSES.includes(a.status)
        ).length

      const countCompletedForNurse = (id: Types.ObjectId) =>
        unitDocs.filter(
          (a) =>
            a.nurseId?.toString() === id.toString() &&
            COMPLETED_STATUSES.includes(a.status)
        ).length

      // --- Fase 2: médicos com ≥5 concluídos ---
      for (const doctorId of pool.doctors) {
        while (
          countCompletedForDoctor(doctorId) < MIN_COMPLETED_PER_DOCTOR
        ) {
          const risk = faker.helpers.arrayElement(riskDistribution)
          const date = randomCompletedStartInWindow(
            windowStart,
            windowEnd,
            risk
          )
          const patientId = faker.helpers.arrayElement(pool.patients)
          const nurseId = pickNurse()
          const { status, history } = buildCompletedFlow(date, risk)
          unitDocs.push(
            seedCompleted({
              number: attendanceNumber++,
              complaint: faker.helpers.arrayElement(complaints),
              diagnosis: faker.helpers.arrayElement(diagnoses),
              date,
              risk,
              status,
              unitId: pool.unitId,
              patientId,
              nurseId,
              doctorId,
              changesHistory: history,
              vitalSigns: randomVitalSigns(),
              createdAt: date,
              updatedAt: date
            })
          )
        }
      }

      // --- Fase 3: enfermeiros com ≥5 concluídos ---
      for (const nurseId of pool.nurses) {
        while (countCompletedForNurse(nurseId) < MIN_COMPLETED_PER_NURSE) {
          const risk = faker.helpers.arrayElement(riskDistribution)
          const date = randomCompletedStartInWindow(
            windowStart,
            windowEnd,
            risk
          )
          const patientId = faker.helpers.arrayElement(pool.patients)
          const doctorId = pickDoctor()
          const { status, history } = buildCompletedFlow(date, risk)
          unitDocs.push(
            seedCompleted({
              number: attendanceNumber++,
              complaint: faker.helpers.arrayElement(complaints),
              diagnosis: faker.helpers.arrayElement(diagnoses),
              date,
              risk,
              status,
              unitId: pool.unitId,
              patientId,
              nurseId,
              doctorId,
              changesHistory: history,
              vitalSigns: randomVitalSigns(),
              createdAt: date,
              updatedAt: date
            })
          )
        }
      }

      // --- Fase 4: ativos (≥2 por médico e ≥2 por enfermeiro), pacientes distintos ---
      const usedPatients = new Set<string>()
      let row = 0
      while (row < activeRowsNeeded) {
        const patient = pool.patients.find((p) => !usedPatients.has(p.toString()))
        if (!patient) {
          await ensurePatients(pool, pool.patients.length + activeRowsNeeded)
          continue
        }
        usedPatients.add(patient.toString())

        const doctorId = pool.doctors[row % D]
        const nurseId = pool.nurses[row % N]
        const minutesAgo = faker.number.int({ min: 20, max: 240 })
        const date = new Date(now.getTime() - minutesAgo * 60_000)
        const risk = faker.helpers.arrayElement(riskDistribution)
        const target = pickActiveTargetStatus()
        const { status, history } = buildActiveFlow(date, risk, target)

        unitDocs.push(
          seedDoc({
            number: attendanceNumber++,
            complaint: faker.helpers.arrayElement(complaints),
            diagnosis: undefined,
            date,
            risk,
            status,
            unitId: pool.unitId,
            patientId: patient,
            nurseId,
            doctorId:
              status !== AttendanceStatus.WAITING_TRIAGE
                ? doctorId
                : undefined,
            changesHistory: history,
            vitalSigns: randomVitalSigns(),
            createdAt: date,
            updatedAt: date
          })
        )
        row++
      }

      // --- Fase 5: extras aleatórios (camada irregular no ano) ---
      const extraCount = Math.min(
        MAX_RANDOM_EXTRA_PER_UNIT,
        faker.number.int({ min: 500, max: MAX_RANDOM_EXTRA_PER_UNIT })
      )
      for (let e = 0; e < extraCount; e++) {
        const risk = faker.helpers.arrayElement(riskDistribution)
        const date = randomCompletedStartInWindow(windowStart, windowEnd, risk)
        const patientId = faker.helpers.arrayElement(pool.patients)
        const nurseId = pickNurse()
        const doctorId = pickDoctor()
        const { status, history } = buildCompletedFlow(date, risk)
        unitDocs.push(
          seedCompleted({
            number: attendanceNumber++,
            complaint: faker.helpers.arrayElement(complaints),
            diagnosis: faker.helpers.arrayElement(diagnoses),
            date,
            risk,
            status,
            unitId: pool.unitId,
            patientId,
            nurseId,
            doctorId,
            changesHistory: history,
            vitalSigns: randomVitalSigns(),
            createdAt: date,
            updatedAt: date
          })
        )
      }

      const baseCount = unitDocs.length
      console.log(
        `   → Base (fases 1–5): ${baseCount} atendimento(s) — inserindo…`
      )
      await insertBatched(unitDocs)

      // --- Fase 6: série diária (concluídos distribuídos por dia civil) ---
      const streamBuf: AttendanceSeed[] = []
      let dailyGenerated = 0

      const appendStream = async (doc: AttendanceSeed) => {
        streamBuf.push(doc)
        if (streamBuf.length >= INSERT_BATCH_SIZE) {
          await insertBatched(streamBuf.splice(0, INSERT_BATCH_SIZE))
        }
      }

      const dayCursor = new Date(windowStart)
      dayCursor.setHours(0, 0, 0, 0)
      const lastCalendarDay = new Date(now)
      lastCalendarDay.setHours(0, 0, 0, 0)

      while (dayCursor.getTime() <= lastCalendarDay.getTime()) {
        const dayStart = new Date(dayCursor)
        const n = attendancesForCalendarDay(pool, dayStart, windowStart)
        for (let i = 0; i < n; i++) {
          const risk = faker.helpers.arrayElement(riskDistribution)
          const date = randomCompletedStartOnCalendarDay(
            dayStart,
            windowEnd,
            risk
          )
          const patientId = faker.helpers.arrayElement(pool.patients)
          const nurseId = pickNurse()
          const doctorId = pickDoctor()
          const { status, history } = buildCompletedFlow(date, risk)
          await appendStream(
            seedCompleted({
              number: attendanceNumber++,
              complaint: faker.helpers.arrayElement(complaints),
              diagnosis: faker.helpers.arrayElement(diagnoses),
              date,
              risk,
              status,
              unitId: pool.unitId,
              patientId,
              nurseId,
              doctorId,
              changesHistory: history,
              vitalSigns: randomVitalSigns(),
              createdAt: date,
              updatedAt: date
            })
          )
          dailyGenerated++
        }
        dayCursor.setDate(dayCursor.getDate() + 1)
      }

      if (streamBuf.length) {
        await insertBatched(streamBuf)
      }

      console.log(
        `   → Série diária (fase 6): +${dailyGenerated} | subtotal unidade ≈ ${baseCount + dailyGenerated}`
      )
    }

    let total = await Attendance.countDocuments()

    if (
      total < TARGET_MIN_TOTAL_ATTENDANCES &&
      total < ABSOLUTE_MAX_TOTAL_ATTENDANCES
    ) {
      console.log(
        `\n↪ Top-up: ${total} < meta ${TARGET_MIN_TOTAL_ATTENDANCES} — lotes de ${INSERT_BATCH_SIZE}…`
      )
      let topUpRound = 0
      while (
        total < TARGET_MIN_TOTAL_ATTENDANCES &&
        total < ABSOLUTE_MAX_TOTAL_ATTENDANCES &&
        topUpRound < MAX_TOP_UP_BATCHES
      ) {
        const buf: AttendanceSeed[] = []
        for (let k = 0; k < INSERT_BATCH_SIZE; k++) {
          const pool = unitPools[(topUpRound + k) % unitPools.length]
          const risk = faker.helpers.arrayElement(riskDistribution)
          const date = randomCompletedStartInWindow(
            windowStart,
            windowEnd,
            risk
          )
          const patientId = faker.helpers.arrayElement(pool.patients)
          const nurseId = faker.helpers.arrayElement(
            pool.nurses
          ) as Types.ObjectId
          const doctorId = faker.helpers.arrayElement(
            pool.doctors
          ) as Types.ObjectId
          const { status, history } = buildCompletedFlow(date, risk)
          buf.push(
            seedCompleted({
              number: attendanceNumber++,
              complaint: faker.helpers.arrayElement(complaints),
              diagnosis: faker.helpers.arrayElement(diagnoses),
              date,
              risk,
              status,
              unitId: pool.unitId,
              patientId,
              nurseId,
              doctorId,
              changesHistory: history,
              vitalSigns: randomVitalSigns(),
              createdAt: date,
              updatedAt: date
            })
          )
        }
        await insertBatched(buf)
        topUpRound++
        total = await Attendance.countDocuments()
      }
      console.log(`↪ Top-up: ${topUpRound} lote(s); total agora: ${total}`)
    }

    console.log(`\n✅ Total no banco: ${total} atendimento(s)`)

    for (const pool of unitPools) {
      const unit = units.find((u) => u._id.toString() === pool.unitId.toString())
      const n = await Attendance.countDocuments({ unitId: pool.unitId })
      console.log(`   ${unit?.name ?? pool.unitId}: ${n}`)
    }

    console.log('\n✅ Script concluído.')
    process.exit(0)
  }
}

export default createAttendances
