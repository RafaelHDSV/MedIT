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

/** Ocupação = ativos / maxOccupancy (reduzida para não dominar o gráfico por dia). */
const OCCUPANCY_TARGET_MIN = 0.45
const OCCUPANCY_TARGET_MAX = 0.68

/** Lotes pequenos para Atlas free / memória estável. */
const INSERT_BATCH_SIZE = 400

/** Regra suprema: máximo de documentos com o mesmo dia civil de `date` (por unidade). */
const MAX_ATTENDANCES_PER_CALENDAR_DAY = 30

/** Meta diária mínima (equalização; sorteio fica entre min e max). */
const MIN_ATTENDANCES_PER_CALENDAR_DAY = 15

/**
 * Meta global para top-up em lotes (0 = desligado: top-up quebraria o teto diário
 * da regra suprema em createAttendances.md).
 */
const TARGET_MIN_TOTAL_ATTENDANCES = 0

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
  /** Capacidade nominal (leitos/vagas) — o dashboard usa isso na ocupação. */
  maxOccupancy: number
  unitName: string
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

/**
 * Ativo com última transição perto de `endTime`; `date` = início (entrada),
 * espalhado no tempo — evita concentrar todos os ativos no “dia atual” nos gráficos.
 */
function buildActiveFlowAnchored(
  endTime: Date,
  risk: AttendanceRisk,
  targetStatus: AttendanceStatus
): {
  status: AttendanceStatus
  date: Date
  history: { status: AttendanceStatus; changedAt: Date }[]
} {
  const idx = FULL_FLOW.indexOf(targetStatus)
  const lastIdx =
    idx >= 0 ? idx : FULL_FLOW.indexOf(AttendanceStatus.IN_ATTENDANCE)
  const stepMs = riskStepMinutes(risk) * 60_000
  const slice = FULL_FLOW.slice(0, lastIdx + 1)
  const startedAt = new Date(endTime.getTime() - lastIdx * stepMs)
  const history = slice.map((status, i) => ({
    status,
    changedAt: new Date(startedAt.getTime() + i * stepMs)
  }))
  return {
    status: slice[slice.length - 1],
    date: startedAt,
    history
  }
}

function windowBounds(now: Date): { start: Date; end: Date } {
  const end = new Date(now)
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - DAYS_BACK)
  return { start, end: end }
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

function startOfLocalDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/**
 * Fração do dia civil já decorrida (evita tratar "hoje" como 24h cheias no seed).
 */
function elapsedDayFraction(now: Date): number {
  const sod = startOfLocalDay(now)
  const raw = (now.getTime() - sod.getTime()) / 86_400_000
  return Math.min(1, Math.max(0.1, raw))
}

/** Meia-noite de um dia aleatório entre o início da janela e hoje (para top-up repartido). */
function randomCalendarDayStartInWindow(windowStart: Date, now: Date): Date {
  const a = startOfLocalDay(windowStart)
  const b = startOfLocalDay(now)
  const span = Math.max(0, Math.floor((b.getTime() - a.getTime()) / 86_400_000))
  const off = faker.number.int({ min: 0, max: span })
  const d = new Date(a)
  d.setDate(d.getDate() + off)
  return d
}

/**
 * Última transição do fluxo ativo dentro do dia `dayStart`, com início (`date`)
 * no mesmo dia civil — reparte ativos no eixo temporal do dashboard.
 */
function randomActiveEndTimeOnCalendarDay(
  dayStart: Date,
  windowStart: Date,
  now: Date,
  risk: AttendanceRisk,
  targetStatus: AttendanceStatus
): Date | null {
  const idx = FULL_FLOW.indexOf(targetStatus)
  const lastIdx =
    idx >= 0 ? idx : FULL_FLOW.indexOf(AttendanceStatus.IN_ATTENDANCE)
  const stepMs = riskStepMinutes(risk) * 60_000
  const flowMs = lastIdx * stepMs

  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  const day0 = startOfLocalDay(dayStart).getTime()
  const ws0 = startOfLocalDay(windowStart).getTime()
  const endMin = Math.max(day0, ws0) + flowMs + 60_000
  const endMax = Math.min(dayEnd.getTime(), now.getTime()) - 2 * 60_000
  if (endMax <= endMin) return null
  return new Date(
    faker.number.int({ min: Math.floor(endMin), max: Math.floor(endMax) })
  )
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
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

/** Prefixos do fluxo real (inclui a caminho e aguardando triagem). */
function pickActiveTargetStatus(): AttendanceStatus {
  return faker.helpers.arrayElement([
    AttendanceStatus.ON_THE_WAY,
    AttendanceStatus.WAITING_TRIAGE,
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
    'Ano rolante: equalização 15–30/dia (teto 30), fluxo completo; ativos só no dia atual; lotes',
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

      const maxOcc = Math.max(
        1,
        Number((unit as { maxOccupancy?: number }).maxOccupancy) || 50
      )

      unitPools.push({
        unitId: new Types.ObjectId(String(unit._id)),
        maxOccupancy: maxOcc,
        unitName: String((unit as { name?: string }).name ?? ''),
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

      const D = pool.doctors.length
      const N = pool.nurses.length
      const P = pool.patients.length

      const occLow = Math.max(
        1,
        Math.ceil(pool.maxOccupancy * OCCUPANCY_TARGET_MIN)
      )
      const occHigh = Math.max(
        occLow,
        Math.floor(pool.maxOccupancy * OCCUPANCY_TARGET_MAX)
      )

      const pickDoctor = () =>
        faker.helpers.arrayElement(pool.doctors) as Types.ObjectId
      const pickNurse = () =>
        faker.helpers.arrayElement(pool.nurses) as Types.ObjectId

      const dayKey = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

      const todayStart = startOfLocalDay(now)
      const calendarDays: Date[] = []
      {
        const c = new Date(windowStart)
        c.setHours(0, 0, 0, 0)
        const last = startOfLocalDay(now)
        while (c.getTime() <= last.getTime()) {
          calendarDays.push(new Date(c))
          c.setDate(c.getDate() + 1)
        }
      }

      const countByDay = new Map<string, number>()
      for (const d of calendarDays) countByDay.set(dayKey(d), 0)

      const roomOn = (d: Date) =>
        MAX_ATTENDANCES_PER_CALENDAR_DAY - (countByDay.get(dayKey(d)) ?? 0)

      const unitDocs: AttendanceSeed[] = []

      const pickDayWithLeastLoad = (): Date | null => {
        let best: Date | null = null
        let bestCount = Infinity
        for (const d of calendarDays) {
          const c = countByDay.get(dayKey(d)) ?? 0
          if (c >= MAX_ATTENDANCES_PER_CALENDAR_DAY) continue
          if (c < bestCount) {
            bestCount = c
            best = d
          }
        }
        return best
      }

      const pushCompletedOnDay = (
        dayStart: Date,
        opts?: {
          patientId?: Types.ObjectId
          nurseId?: Types.ObjectId
          doctorId?: Types.ObjectId
        }
      ): boolean => {
        const k = dayKey(dayStart)
        if ((countByDay.get(k) ?? 0) >= MAX_ATTENDANCES_PER_CALENDAR_DAY) {
          return false
        }
        const risk = faker.helpers.arrayElement(riskDistribution)
        const date = randomCompletedStartOnCalendarDay(
          dayStart,
          windowEnd,
          risk
        )
        const nurseId = opts?.nurseId ?? pickNurse()
        const doctorId = opts?.doctorId ?? pickDoctor()
        const patientId =
          opts?.patientId ?? faker.helpers.arrayElement(pool.patients)
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
        countByDay.set(k, (countByDay.get(k) ?? 0) + 1)
        return true
      }

      const dailyTarget = faker.number.int({
        min: MIN_ATTENDANCES_PER_CALENDAR_DAY,
        max: MAX_ATTENDANCES_PER_CALENDAR_DAY
      })

      for (const dayStart of calendarDays) {
        if (isSameCalendarDay(dayStart, now)) {
          const capToday = Math.max(
            4,
            Math.ceil(dailyTarget * elapsedDayFraction(now))
          )
          const nToday = Math.min(dailyTarget, capToday, roomOn(dayStart))
          for (let i = 0; i < nToday; i++) {
            if (!pushCompletedOnDay(dayStart)) break
          }
          continue
        }

        let added = 0
        while (added < dailyTarget && roomOn(dayStart) > 0) {
          if (!pushCompletedOnDay(dayStart)) break
          added++
        }
      }

      let activeGoal = faker.number.int({ min: occLow, max: occHigh })
      activeGoal = Math.min(activeGoal, Math.max(0, roomOn(todayStart)))
      if (pool.patients.length < activeGoal) {
        console.log(
          `   Ajustando pool de pacientes (${P} → ≥${activeGoal} para ativos do dia)`
        )
        await ensurePatients(pool, activeGoal)
      }

      const usedPatients = new Set<string>()
      let row = 0
      while (row < activeGoal) {
        const patient = pool.patients.find(
          (p) => !usedPatients.has(p.toString())
        )
        if (!patient) {
          await ensurePatients(pool, pool.patients.length + activeGoal)
          continue
        }
        usedPatients.add(patient.toString())

        const doctorId = pool.doctors[row % D]
        const nurseId = pool.nurses[row % N]
        const risk = faker.helpers.arrayElement(riskDistribution)
        const target = pickActiveTargetStatus()

        let status: AttendanceStatus = AttendanceStatus.IN_TRIAGE
        let history: { status: AttendanceStatus; changedAt: Date }[] = []
        let date: Date = new Date(todayStart.getTime() + 60_000)
        let lastAt: Date = new Date(now)
        let ok = false
        for (let attempt = 0; attempt < 50 && !ok; attempt++) {
          const endTime = randomActiveEndTimeOnCalendarDay(
            todayStart,
            windowStart,
            now,
            risk,
            target
          )
          if (!endTime) continue
          const built = buildActiveFlowAnchored(endTime, risk, target)
          if (
            built.date.getTime() >= todayStart.getTime() &&
            built.date.getTime() < todayStart.getTime() + 86_400_000
          ) {
            status = built.status
            history = built.history
            date = built.date
            lastAt = history[history.length - 1]?.changedAt ?? endTime
            ok = true
          }
        }
        if (!ok) {
          const fbRisk = AttendanceRisk.NOT_URGENT
          const fbTarget = AttendanceStatus.IN_ATTENDANCE
          for (let attempt = 0; attempt < 80 && !ok; attempt++) {
            const endTime = randomActiveEndTimeOnCalendarDay(
              todayStart,
              windowStart,
              now,
              fbRisk,
              fbTarget
            )
            if (!endTime) continue
            const built = buildActiveFlowAnchored(endTime, fbRisk, fbTarget)
            if (
              built.date.getTime() >= todayStart.getTime() &&
              built.date.getTime() < todayStart.getTime() + 86_400_000
            ) {
              status = built.status
              history = built.history
              date = built.date
              lastAt = history[history.length - 1]?.changedAt ?? endTime
              ok = true
            }
          }
        }
        if (!ok) {
          const endTime = new Date(
            now.getTime() - faker.number.int({ min: 15, max: 120 }) * 60_000
          )
          const built = buildActiveFlowAnchored(endTime, risk, target)
          status = built.status
          history = built.history
          date = built.date
          lastAt = history[history.length - 1]?.changedAt ?? endTime
        }

        if (roomOn(todayStart) <= 0) break

        const needsDoctor =
          status !== AttendanceStatus.WAITING_TRIAGE &&
          status !== AttendanceStatus.ON_THE_WAY

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
            doctorId: needsDoctor ? doctorId : undefined,
            changesHistory: history,
            vitalSigns: randomVitalSigns(),
            createdAt: date,
            updatedAt: lastAt
          })
        )
        countByDay.set(
          dayKey(todayStart),
          (countByDay.get(dayKey(todayStart)) ?? 0) + 1
        )
        row++
      }

      const countCompletedForPatient = (id: Types.ObjectId) =>
        unitDocs.filter(
          (a) =>
            a.patientId.toString() === id.toString() &&
            COMPLETED_STATUSES.includes(a.status)
        ).length

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

      // --- Mínimos por paciente / médico / enfermeiro (respeitando teto diário) ---
      for (const patientId of pool.patients) {
        while (countCompletedForPatient(patientId) < MIN_COMPLETED_PER_PATIENT) {
          const dayPick = pickDayWithLeastLoad()
          if (!dayPick) {
            console.warn(
              `   ⚠️  Teto ${MAX_ATTENDANCES_PER_CALENDAR_DAY}/dia: não coube o mínimo por paciente (${patientId}).`
            )
            break
          }
          if (
            !pushCompletedOnDay(dayPick, {
              patientId,
              nurseId: pickNurse(),
              doctorId: pickDoctor()
            })
          ) {
            break
          }
        }
      }

      for (const doctorId of pool.doctors) {
        while (countCompletedForDoctor(doctorId) < MIN_COMPLETED_PER_DOCTOR) {
          const dayPick = pickDayWithLeastLoad()
          if (!dayPick) {
            console.warn(
              `   ⚠️  Teto ${MAX_ATTENDANCES_PER_CALENDAR_DAY}/dia: não coube o mínimo por médico (${doctorId}).`
            )
            break
          }
          if (
            !pushCompletedOnDay(dayPick, {
              doctorId,
              patientId: faker.helpers.arrayElement(pool.patients),
              nurseId: pickNurse()
            })
          ) {
            break
          }
        }
      }

      for (const nurseId of pool.nurses) {
        while (countCompletedForNurse(nurseId) < MIN_COMPLETED_PER_NURSE) {
          const dayPick = pickDayWithLeastLoad()
          if (!dayPick) {
            console.warn(
              `   ⚠️  Teto ${MAX_ATTENDANCES_PER_CALENDAR_DAY}/dia: não coube o mínimo por enfermeiro (${nurseId}).`
            )
            break
          }
          if (
            !pushCompletedOnDay(dayPick, {
              nurseId,
              patientId: faker.helpers.arrayElement(pool.patients),
              doctorId: pickDoctor()
            })
          ) {
            break
          }
        }
      }

      const baseCount = unitDocs.length
      console.log(
        `   → Unidade: ${baseCount} atendimento(s) (≤${MAX_ATTENDANCES_PER_CALENDAR_DAY}/dia, meta diária ${dailyTarget}) — inserindo…`
      )
      await insertBatched(unitDocs)
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
          const dayPick = randomCalendarDayStartInWindow(windowStart, now)
          const date = randomCompletedStartOnCalendarDay(
            dayPick,
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
