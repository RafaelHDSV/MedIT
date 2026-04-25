import { faker } from '@faker-js/faker'
import { Types } from 'mongoose'
import { toDiseaseLabelPt } from '../../constants/diseaseLabelsPt.js'
import {
  AttendanceRisk,
  AttendanceStatus,
  PatientDisposition,
  type IPrescribedMedication,
  type IVitalSigns
} from '../../interfaces/IAttendance.js'
import { BloodType } from '../../interfaces/IPatient.js'
import { Attendance } from '../../models/AttendanceModel.js'
import { Doctor } from '../../models/DoctorModel.js'
import { Nurse } from '../../models/NurseModel.js'
import { Patient } from '../../models/PatientModel.js'
import SymptomsDiseasesModel from '../../models/SymptomsDiseasesModel.js'
import { Unit } from '../../models/UnitModel.js'
import type { Script } from '../types.js'

// ── Configuration ───────────────────────────────────────────────────────────

const DAYS_BACK = 364
const INSERT_BATCH_SIZE = 400

/** Daily target ranges (equalization). */
const WEEKDAY_TARGET_MIN = 21
const WEEKDAY_TARGET_MAX = 26
const WEEKEND_TARGET_MIN = 14
const WEEKEND_TARGET_MAX = 19
const ABSOLUTE_MAX_PER_DAY = 30
const TODAY_TOTAL_CAP = 45

/** TCC member minimums. */
const TCC_MIN_COMPLETED_PER_PATIENT = 10
const TCC_MIN_COMPLETED_PER_DOCTOR = 8
const TCC_MIN_COMPLETED_PER_NURSE = 8

/** Unassigned queue minimums per unit. */
const MIN_QUEUE_WAITING_TRIAGE = 5
const MIN_QUEUE_WAITING_ATTENDANCE = 5

/** Each TCC professional gets at least this many assigned active attendances. */
const TCC_ACTIVE_PER_DOCTOR = 2
const TCC_ACTIVE_PER_NURSE = 1

const RISK_WEIGHTS: { value: AttendanceRisk; weight: number }[] = [
  { value: AttendanceRisk.NOT_URGENT, weight: 30 },
  { value: AttendanceRisk.LESS_URGENT, weight: 25 },
  { value: AttendanceRisk.URGENT, weight: 20 },
  { value: AttendanceRisk.VERY_URGENT, weight: 15 },
  { value: AttendanceRisk.EMERGENCY, weight: 10 }
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

const COMPLETED_STATUSES = new Set<AttendanceStatus>([
  AttendanceStatus.ATTENDANCE_COMPLETED,
  AttendanceStatus.COMPLETED
])

const TRIAGE_OR_LATER = new Set<AttendanceStatus>([
  AttendanceStatus.WAITING_TRIAGE,
  AttendanceStatus.IN_TRIAGE,
  AttendanceStatus.TRIAGE_COMPLETED,
  AttendanceStatus.WAITING_ATTENDANCE,
  AttendanceStatus.IN_ATTENDANCE,
  AttendanceStatus.ATTENDANCE_COMPLETED,
  AttendanceStatus.COMPLETED
])

// ── Static Data ─────────────────────────────────────────────────────────────

const COMPLAINTS = [
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

const SYMPTOM_KEY_TO_COMPLAINTS: Record<string, string[]> = {
  fever: ['Febre'],
  headache: ['Dor de cabeça'],
  cough: ['Tosse persistente'],
  dryCough: ['Tosse persistente'],
  soreThroat: ['Dor de garganta'],
  abdominalPain: ['Dor abdominal'],
  nausea: ['Náusea'],
  nauseaVomiting: ['Náusea'],
  chestPain: ['Dor no peito'],
  shortnessOfBreath: ['Falta de ar'],
  breathlessness: ['Falta de ar'],
  dizziness: ['Tontura'],
  backPain: ['Dor lombar'],
  lowerBackPain: ['Dor lombar'],
  dysuria: ['Ardor ao urinar'],
  diarrhea: ['Diarreia'],
  runnyNose: ['Coriza e espirros'],
  sneezing: ['Coriza e espirros'],
  fatigue: ['Febre', 'Tontura'],
  jointPain: ['Dor no joelho'],
  musclePain: ['Dor lombar'],
  palpitation: ['Palpitação']
}

const OBSERVATIONS = [
  'Paciente orientado e cooperativo durante toda a triagem.',
  'Relato de início dos sintomas há aproximadamente 2 a 3 dias.',
  'Paciente refere automedicação com analgésicos comuns sem melhora.',
  'Sinais vitais estáveis na admissão.',
  'Paciente acompanhado por familiar durante o atendimento.',
  'Histórico pessoal sem comorbidades relevantes.',
  'Paciente relata episódios semelhantes nos últimos meses.',
  'Nega uso de medicações contínuas.',
  'Paciente relata piora progressiva do quadro.',
  'Orientado quanto à importância de retorno em caso de piora.',
  'Paciente calmo e colaborativo.',
  'Exame físico sem alterações significativas.',
  'Paciente com queixa de evolução aguda.',
  'Encaminhado para avaliação complementar conforme protocolo.'
]

const CONDITIONS_POOL = [
  'Hipertensão',
  'Diabetes mellitus',
  'Asma',
  'Enxaqueca',
  'Dislipidemia',
  'Doença renal crônica',
  'Doença autoimune',
  'Cardiopatia'
]

const ALLERGIES_POOL = [
  'Dipirona',
  'Penicilina',
  'Amoxicilina',
  'AINEs',
  'Látex',
  'Frutos do mar',
  'Picada de inseto',
  'Sem alergias conhecidas'
]

const MEDICATION_POOL: { name: string; dosages: string[] }[] = [
  { name: 'Dipirona', dosages: ['500mg', '1g'] },
  { name: 'Paracetamol', dosages: ['500mg', '750mg'] },
  { name: 'Ibuprofeno', dosages: ['400mg', '600mg'] },
  { name: 'Amoxicilina', dosages: ['500mg', '875mg'] },
  { name: 'Azitromicina', dosages: ['500mg'] },
  { name: 'Omeprazol', dosages: ['20mg', '40mg'] },
  { name: 'Dexametasona', dosages: ['4mg'] },
  { name: 'Loratadina', dosages: ['10mg'] },
  { name: 'Metoclopramida', dosages: ['10mg'] },
  { name: 'Buscopan Composto', dosages: ['10mg + 250mg'] },
  { name: 'Simeticona', dosages: ['125mg'] },
  { name: 'Diclofenaco', dosages: ['50mg'] }
]

const MEDICATION_FREQUENCIES = [
  '8 em 8 horas',
  '12 em 12 horas',
  '6 em 6 horas',
  '1x ao dia',
  '2x ao dia'
]
const MEDICATION_DURATIONS = ['3 dias', '5 dias', '7 dias', '10 dias', '14 dias']

const EXAM_POOL = [
  'Hemograma completo',
  'PCR',
  'VHS',
  'Glicemia de jejum',
  'Ureia e creatinina',
  'TGO e TGP',
  'Raio-X de tórax',
  'ECG',
  'Urina tipo I',
  'Ultrassonografia abdominal'
]

const DIAGNOSIS_TEXTS = [
  'Quadro clínico compatível com o diagnóstico proposto. Paciente orientado sobre tratamento.',
  'Evolução favorável após medicação inicial. Alta com orientações.',
  'Paciente estável, sem sinais de gravidade. Acompanhamento ambulatorial recomendado.',
  'Quadro autolimitado. Prescrito tratamento sintomático e repouso.',
  'Melhora significativa após hidratação e medicação. Alta médica.',
  'Exames complementares sem alterações relevantes. Seguimento em UBS.'
]

const FALLBACK_DIAGNOSES = [
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

// ── Types ───────────────────────────────────────────────────────────────────

type UnitPool = {
  unitId: Types.ObjectId
  maxOccupancy: number
  unitName: string
  patients: Types.ObjectId[]
  nurses: Types.ObjectId[]
  doctors: Types.ObjectId[]
}

type AttendanceSeed = {
  number: number
  complaint: string
  diagnosisKey?: string
  diagnosis?: string
  diagnosisText?: string
  date: Date
  risk: AttendanceRisk
  status: AttendanceStatus
  unitId: Types.ObjectId
  patientId: Types.ObjectId
  nurseId?: Types.ObjectId
  doctorId?: Types.ObjectId
  medicationsIds: Types.ObjectId[]
  changesHistory: { status: AttendanceStatus; changedAt: Date }[]
  vitalSigns: IVitalSigns
  iaConditionId: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  painLevel?: number
  selfMedicated?: boolean
  symptomStartDate?: Date
  symptoms?: string[]
  generalObservation?: string
  conditions?: string[]
  allergies?: string[]
  patientDisposition?: PatientDisposition
  prescribedMedications?: IPrescribedMedication[]
  prescribedExams?: string[]
}

type DiseaseProfile = {
  disease: string
  positiveSymptoms: string[]
}

type SymptomsDiseaseSeedRow = {
  disease: string
  symptoms?: Record<string, number> | Map<string, number>
}

// ── Weighted Random Helpers ─────────────────────────────────────────────────

function weightedPick<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0)
  let r = Math.random() * total
  for (const item of items) {
    r -= item.weight
    if (r <= 0) return item.value
  }
  return items[items.length - 1].value
}

function pickRisk(): AttendanceRisk {
  return weightedPick(RISK_WEIGHTS)
}

/**
 * Weighted hour: heavier 8h–20h, lighter overnight.
 * Realistic for an emergency room.
 */
const HOUR_WEIGHTS = [
  1, 1, 1, 1, 1, 2, 3, 5, 10, 12, 12, 11, 8, 9, 11, 12, 11, 10, 8, 7, 5, 4,
  2, 1
]

function randomWeightedHour(): number {
  const items = HOUR_WEIGHTS.map((w, h) => ({ value: h, weight: w }))
  return weightedPick(items)
}

// ── Vital Signs (risk-correlated) ───────────────────────────────────────────

function vitalSignsForRisk(risk: AttendanceRisk): IVitalSigns {
  switch (risk) {
    case AttendanceRisk.EMERGENCY:
      return {
        temperature: faker.number.float({ min: 38.5, max: 40.5, fractionDigits: 1 }),
        heartRate: faker.number.int({ min: 110, max: 160 }),
        oxygenSaturation: faker.number.int({ min: 85, max: 93 }),
        bloodPressure: `${faker.number.int({ min: 160, max: 200 })}/${faker.number.int({ min: 90, max: 120 })}`
      }
    case AttendanceRisk.VERY_URGENT:
      return {
        temperature: faker.number.float({ min: 38.0, max: 39.5, fractionDigits: 1 }),
        heartRate: faker.number.int({ min: 95, max: 135 }),
        oxygenSaturation: faker.number.int({ min: 90, max: 95 }),
        bloodPressure: `${faker.number.int({ min: 140, max: 180 })}/${faker.number.int({ min: 80, max: 110 })}`
      }
    case AttendanceRisk.URGENT:
      return {
        temperature: faker.number.float({ min: 37.5, max: 39.0, fractionDigits: 1 }),
        heartRate: faker.number.int({ min: 85, max: 115 }),
        oxygenSaturation: faker.number.int({ min: 93, max: 97 }),
        bloodPressure: `${faker.number.int({ min: 130, max: 160 })}/${faker.number.int({ min: 75, max: 100 })}`
      }
    case AttendanceRisk.LESS_URGENT:
      return {
        temperature: faker.number.float({ min: 36.5, max: 38.0, fractionDigits: 1 }),
        heartRate: faker.number.int({ min: 70, max: 100 }),
        oxygenSaturation: faker.number.int({ min: 95, max: 99 }),
        bloodPressure: `${faker.number.int({ min: 110, max: 140 })}/${faker.number.int({ min: 65, max: 90 })}`
      }
    default:
      return {
        temperature: faker.number.float({ min: 36.0, max: 37.5, fractionDigits: 1 }),
        heartRate: faker.number.int({ min: 60, max: 90 }),
        oxygenSaturation: faker.number.int({ min: 96, max: 100 }),
        bloodPressure: `${faker.number.int({ min: 100, max: 130 })}/${faker.number.int({ min: 60, max: 85 })}`
      }
  }
}

function painLevelForRisk(risk: AttendanceRisk): number {
  switch (risk) {
    case AttendanceRisk.EMERGENCY:
      return faker.number.int({ min: 7, max: 10 })
    case AttendanceRisk.VERY_URGENT:
      return faker.number.int({ min: 5, max: 9 })
    case AttendanceRisk.URGENT:
      return faker.number.int({ min: 4, max: 7 })
    case AttendanceRisk.LESS_URGENT:
      return faker.number.int({ min: 2, max: 5 })
    default:
      return faker.number.int({ min: 0, max: 3 })
  }
}

// ── Time Helpers ────────────────────────────────────────────────────────────

function startOfLocalDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isWeekend(d: Date): boolean {
  const dow = d.getDay()
  return dow === 0 || dow === 6
}

function elapsedDayFraction(now: Date): number {
  const sod = startOfLocalDay(now)
  return Math.min(1, Math.max(0.1, (now.getTime() - sod.getTime()) / 86_400_000))
}

function riskStepMinutes(risk: AttendanceRisk): number {
  const base: Record<AttendanceRisk, number> = {
    [AttendanceRisk.EMERGENCY]: 5,
    [AttendanceRisk.VERY_URGENT]: 10,
    [AttendanceRisk.URGENT]: 15,
    [AttendanceRisk.LESS_URGENT]: 25,
    [AttendanceRisk.NOT_URGENT]: 35
  }
  return base[risk] ?? 20
}

function randomDateOnCalendarDay(dayStart: Date, now: Date): Date {
  const hour = randomWeightedHour()
  const minute = faker.number.int({ min: 0, max: 59 })
  const second = faker.number.int({ min: 0, max: 59 })

  const d = new Date(dayStart)
  d.setHours(hour, minute, second, 0)

  if (d.getTime() > now.getTime()) {
    d.setTime(now.getTime() - faker.number.int({ min: 60_000, max: 600_000 }))
  }
  return d
}

// ── Flow Builders ───────────────────────────────────────────────────────────

function buildCompletedFlow(
  startedAt: Date,
  risk: AttendanceRisk
): { status: AttendanceStatus; history: { status: AttendanceStatus; changedAt: Date }[] } {
  const baseStepMs = riskStepMinutes(risk) * 60_000
  let cursor = startedAt.getTime()

  const history = FULL_FLOW.map((status) => {
    const entry = { status, changedAt: new Date(cursor) }
    const jitter = faker.number.float({ min: 0.7, max: 1.3, fractionDigits: 2 })
    cursor += Math.max(60_000, Math.round(baseStepMs * jitter))
    return entry
  })

  return { status: AttendanceStatus.COMPLETED, history }
}

function buildActiveFlow(
  endTime: Date,
  risk: AttendanceRisk,
  targetStatus: AttendanceStatus
): {
  status: AttendanceStatus
  date: Date
  history: { status: AttendanceStatus; changedAt: Date }[]
} {
  const idx = FULL_FLOW.indexOf(targetStatus)
  const lastIdx = idx >= 0 ? idx : FULL_FLOW.indexOf(AttendanceStatus.IN_ATTENDANCE)
  const baseStepMs = riskStepMinutes(risk) * 60_000
  const slice = FULL_FLOW.slice(0, lastIdx + 1)
  const startedAt = new Date(endTime.getTime() - lastIdx * baseStepMs)

  const history = slice.map((status, i) => ({
    status,
    changedAt: new Date(startedAt.getTime() + i * baseStepMs)
  }))

  return { status: slice[slice.length - 1], date: startedAt, history }
}

// ── Clinical Data Builders ──────────────────────────────────────────────────

function getPositiveSymptomKeys(
  symptoms: SymptomsDiseaseSeedRow['symptoms']
): string[] {
  if (!symptoms) return []
  const asRecord =
    symptoms instanceof Map ? Object.fromEntries(symptoms.entries()) : symptoms
  return Object.entries(asRecord)
    .filter(([, weight]) => Number(weight) > 0)
    .map(([key]) => key)
}

function pickComplaintFromSymptoms(symptoms: string[]): string {
  const candidates: string[] = []
  for (const s of symptoms) {
    const mapped = SYMPTOM_KEY_TO_COMPLAINTS[s]
    if (mapped) candidates.push(...mapped)
  }
  if (candidates.length > 0) {
    return faker.helpers.arrayElement([...new Set(candidates)])
  }
  return faker.helpers.arrayElement(COMPLAINTS)
}

function buildSymptoms(
  status: AttendanceStatus,
  diseaseProfile?: DiseaseProfile
): string[] | undefined {
  const reachedTriage = TRIAGE_OR_LATER.has(status)
  if (reachedTriage) {
    const pool =
      diseaseProfile?.positiveSymptoms?.length
        ? diseaseProfile.positiveSymptoms
        : ['fever', 'fatigue', 'headache']
    return faker.helpers.arrayElements(pool, {
      min: Math.max(1, Math.min(2, pool.length)),
      max: Math.max(1, Math.min(6, pool.length))
    })
  }
  if (faker.datatype.boolean({ probability: 0.25 })) {
    const pool =
      diseaseProfile?.positiveSymptoms?.length
        ? diseaseProfile.positiveSymptoms
        : ['fever', 'dryCough']
    return faker.helpers.arrayElements(pool, {
      min: 1,
      max: Math.min(3, pool.length)
    })
  }
  return undefined
}

function buildPrescriptions(risk: AttendanceRisk): {
  prescribedMedications?: IPrescribedMedication[]
  prescribedExams?: string[]
  patientDisposition?: PatientDisposition
  diagnosisText?: string
} {
  if (!faker.datatype.boolean({ probability: 0.6 })) return {}

  const medCount = faker.number.int({ min: 1, max: 3 })
  const used = new Set<string>()
  const meds: IPrescribedMedication[] = []
  for (let i = 0; i < medCount; i++) {
    const entry = faker.helpers.arrayElement(MEDICATION_POOL)
    if (used.has(entry.name)) continue
    used.add(entry.name)
    meds.push({
      name: entry.name,
      dosage: faker.helpers.arrayElement(entry.dosages),
      frequency: faker.helpers.arrayElement(MEDICATION_FREQUENCIES),
      duration: faker.helpers.arrayElement(MEDICATION_DURATIONS)
    })
  }

  const exams = faker.datatype.boolean({ probability: 0.4 })
    ? faker.helpers.arrayElements(EXAM_POOL, { min: 1, max: 3 })
    : undefined

  const isHighRisk =
    risk === AttendanceRisk.EMERGENCY || risk === AttendanceRisk.VERY_URGENT

  const dispositionPool = [
    PatientDisposition.HOME,
    PatientDisposition.HOME,
    PatientDisposition.HOME,
    PatientDisposition.HOME,
    PatientDisposition.HOME,
    PatientDisposition.OBSERVATION,
    PatientDisposition.OBSERVATION,
    PatientDisposition.HOSPITALIZED,
    ...(isHighRisk
      ? [PatientDisposition.HOSPITALIZED, PatientDisposition.TRANSFER]
      : [])
  ]

  return {
    prescribedMedications: meds.length > 0 ? meds : undefined,
    prescribedExams: exams,
    patientDisposition: faker.helpers.arrayElement(dispositionPool),
    diagnosisText: faker.datatype.boolean({ probability: 0.3 })
      ? faker.helpers.arrayElement(DIAGNOSIS_TEXTS)
      : undefined
  }
}

// ── Document Assembly ───────────────────────────────────────────────────────

function assembleSeed(
  base: Omit<
    AttendanceSeed,
    'medicationsIds' | 'iaConditionId' | 'vitalSigns' | 'painLevel'
  > &
    Partial<Pick<AttendanceSeed, 'vitalSigns' | 'painLevel'>>
): AttendanceSeed {
  return {
    ...base,
    vitalSigns: base.vitalSigns ?? vitalSignsForRisk(base.risk),
    painLevel: base.painLevel ?? painLevelForRisk(base.risk),
    medicationsIds: [],
    iaConditionId: new Types.ObjectId()
  }
}

// ── Batch Insert ────────────────────────────────────────────────────────────

async function insertBatched(docs: AttendanceSeed[]): Promise<void> {
  for (let i = 0; i < docs.length; i += INSERT_BATCH_SIZE) {
    const chunk = docs.slice(i, i + INSERT_BATCH_SIZE)
    await Attendance.insertMany(chunk, { ordered: false, timestamps: false })
  }
}

// ── Patient Pool Management ─────────────────────────────────────────────────

async function ensurePatients(
  pool: UnitPool,
  minCount: number
): Promise<void> {
  while (pool.patients.length < minCount) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const created = (await Patient.create({
      name: `${firstName} ${lastName}`,
      cpf: faker.string.numeric(11),
      email: faker.internet.email({ firstName, lastName, provider: 'seed.med.br' }),
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
  }
}

// ── Main Script ─────────────────────────────────────────────────────────────

const createAttendances: Script = {
  name: 'create-attendances',
  description:
    'Ano rolante equalizado; sinais vitais correlacionados; mínimos TCC; fila ativa; lotes seguros',

  async run() {
    console.log('❌ Removendo atendimentos existentes…')
    const deleted = await Attendance.deleteMany()
    console.log(`   ${deleted.deletedCount} documento(s) removido(s)`)

    const now = new Date()
    const windowStart = startOfLocalDay(now)
    windowStart.setDate(windowStart.getDate() - DAYS_BACK)
    const windowEnd = new Date(now)

    console.log(
      `📅 Janela: ${windowStart.toISOString().slice(0, 10)} → ${windowEnd.toISOString().slice(0, 10)} (~${DAYS_BACK + 1} dias)`
    )

    // ── Load units ──────────────────────────────────────────────────────

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
          `⚠️  Unidade "${(unit as { name?: string }).name}" sem pacientes/enfermeiros/médicos — ignorada`
        )
        continue
      }

      unitPools.push({
        unitId: new Types.ObjectId(String(unit._id)),
        maxOccupancy: Math.max(1, Number((unit as { maxOccupancy?: number }).maxOccupancy) || 50),
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

    // ── Detect TCC members ──────────────────────────────────────────────

    const tccPatientIdSet = new Set(
      (await Patient.find({ email: { $regex: '@yopmail\\.com$' } } as never)
        .select('_id')
        .lean<{ _id: Types.ObjectId }[]>())
        .map((p) => String(p._id))
    )
    const tccNurseIdSet = new Set(
      (await Nurse.find({ email: { $regex: '@yopmail\\.com$' } } as never)
        .select('_id')
        .lean<{ _id: Types.ObjectId }[]>())
        .map((n) => String(n._id))
    )
    const tccDoctorIdSet = new Set(
      (await Doctor.find({ email: { $regex: '@yopmail\\.com$' } } as never)
        .select('_id')
        .lean<{ _id: Types.ObjectId }[]>())
        .map((d) => String(d._id))
    )

    console.log(
      `🎓 TCC: ${tccPatientIdSet.size} pacientes, ${tccNurseIdSet.size} enfermeiros, ${tccDoctorIdSet.size} médicos`
    )

    // ── Load disease profiles ───────────────────────────────────────────

    const symptomsDiseases = await SymptomsDiseasesModel.find()
      .select('disease symptoms')
      .lean<SymptomsDiseaseSeedRow[]>()

    const diseaseProfiles: DiseaseProfile[] = symptomsDiseases
      .map((row) => ({
        disease: row.disease,
        positiveSymptoms: getPositiveSymptomKeys(row.symptoms)
      }))
      .filter((r) => r.disease && r.positiveSymptoms.length > 0)

    const pickDiseaseProfile = (): DiseaseProfile | undefined =>
      diseaseProfiles.length
        ? (faker.helpers.arrayElement(diseaseProfiles) as DiseaseProfile)
        : undefined

    console.log(`✅ ${unitPools.length} unidade(s), ${diseaseProfiles.length} perfis de doença\n`)

    // ── Build calendar days ─────────────────────────────────────────────

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

    const todayStart = startOfLocalDay(now)

    let attendanceNumber = 1

    // ── Per-unit generation ─────────────────────────────────────────────

    for (const pool of unitPools) {
      console.log(`🏥 Unidade "${pool.unitName}" (${pool.unitId})`)

      const unitTccPatients = pool.patients.filter((id) => tccPatientIdSet.has(String(id)))
      const unitTccNurses = pool.nurses.filter((id) => tccNurseIdSet.has(String(id)))
      const unitTccDoctors = pool.doctors.filter((id) => tccDoctorIdSet.has(String(id)))

      // Shuffle pools for natural distribution while keeping round-robin fairness
      const shuffledPatients = faker.helpers.shuffle([...pool.patients])
      const shuffledNurses = faker.helpers.shuffle([...pool.nurses])
      const shuffledDoctors = faker.helpers.shuffle([...pool.doctors])

      let pIdx = 0
      let nIdx = 0
      let dIdx = 0
      const nextPatient = () => shuffledPatients[pIdx++ % shuffledPatients.length]
      const nextNurse = () => shuffledNurses[nIdx++ % shuffledNurses.length]
      const nextDoctor = () => shuffledDoctors[dIdx++ % shuffledDoctors.length]

      // Tracking
      const countByDay = new Map<string, number>()
      const completedByPatient = new Map<string, number>()
      const completedByDoctor = new Map<string, number>()
      const completedByNurse = new Map<string, number>()
      const unitDocs: AttendanceSeed[] = []

      for (const d of calendarDays) countByDay.set(dayKey(d), 0)

      const roomOnDay = (d: Date) =>
        ABSOLUTE_MAX_PER_DAY - (countByDay.get(dayKey(d)) ?? 0)

      const incCounters = (doc: AttendanceSeed) => {
        const k = dayKey(doc.date)
        countByDay.set(k, (countByDay.get(k) ?? 0) + 1)
        if (COMPLETED_STATUSES.has(doc.status)) {
          const pid = String(doc.patientId)
          completedByPatient.set(pid, (completedByPatient.get(pid) ?? 0) + 1)
          if (doc.doctorId) {
            const did = String(doc.doctorId)
            completedByDoctor.set(did, (completedByDoctor.get(did) ?? 0) + 1)
          }
          if (doc.nurseId) {
            const nid = String(doc.nurseId)
            completedByNurse.set(nid, (completedByNurse.get(nid) ?? 0) + 1)
          }
        }
      }

      const pushCompleted = (
        dayStart: Date,
        opts: {
          patientId: Types.ObjectId
          nurseId: Types.ObjectId
          doctorId: Types.ObjectId
        }
      ): boolean => {
        if (roomOnDay(dayStart) <= 0) return false

        const risk = pickRisk()
        const startDate = randomDateOnCalendarDay(dayStart, windowEnd)
        const diseaseProfile = pickDiseaseProfile()
        const { status, history } = buildCompletedFlow(startDate, risk)
        const symptoms = buildSymptoms(status, diseaseProfile)
        const complaint =
          symptoms?.length ? pickComplaintFromSymptoms(symptoms) : faker.helpers.arrayElement(COMPLAINTS)

        const diagnosis = diseaseProfile?.disease
          ? toDiseaseLabelPt(diseaseProfile.disease)
          : faker.helpers.arrayElement(FALLBACK_DIAGNOSES)

        const selfMedicated = faker.datatype.boolean({
          probability: risk === AttendanceRisk.NOT_URGENT ? 0.4 : 0.15
        })

        const lastHistoryAt = history[history.length - 1]?.changedAt ?? startDate

        const doc = assembleSeed({
          number: attendanceNumber++,
          complaint,
          diagnosisKey: diseaseProfile?.disease,
          diagnosis,
          date: startDate,
          risk,
          status,
          unitId: pool.unitId,
          patientId: opts.patientId,
          nurseId: opts.nurseId,
          doctorId: opts.doctorId,
          changesHistory: history,
          createdAt: startDate,
          updatedAt: lastHistoryAt,
          symptoms,
          selfMedicated,
          symptomStartDate: new Date(
            startDate.getTime() - faker.number.int({ min: 1, max: 7 }) * 86_400_000
          ),
          generalObservation: faker.datatype.boolean({ probability: 0.35 })
            ? faker.helpers.arrayElement(OBSERVATIONS)
            : undefined,
          conditions: faker.helpers.arrayElements(CONDITIONS_POOL, {
            min: 0,
            max: 2
          }),
          allergies: faker.helpers.arrayElements(ALLERGIES_POOL, {
            min: 0,
            max: 2
          }),
          ...buildPrescriptions(risk)
        })

        unitDocs.push(doc)
        incCounters(doc)
        return true
      }

      // ── Phase 1: fill calendar days with completed attendances ────────

      for (const day of calendarDays) {
        const isToday = isSameCalendarDay(day, todayStart)
        let target: number

        if (isToday) {
          const fraction = elapsedDayFraction(now)
          const base = isWeekend(day) ? WEEKEND_TARGET_MIN : WEEKDAY_TARGET_MIN
          target = Math.max(3, Math.ceil(base * fraction))
        } else {
          const min = isWeekend(day) ? WEEKEND_TARGET_MIN : WEEKDAY_TARGET_MIN
          const max = isWeekend(day) ? WEEKEND_TARGET_MAX : WEEKDAY_TARGET_MAX
          const mid = (min + max) / 2
          const jitter = faker.number.int({ min: -2, max: 2 })
          target = Math.max(min, Math.min(max, Math.round(mid + jitter)))
        }

        for (let i = 0; i < target; i++) {
          if (
            !pushCompleted(day, {
              patientId: nextPatient(),
              nurseId: nextNurse(),
              doctorId: nextDoctor()
            })
          ) {
            break
          }
        }
      }

      console.log(`   📊 Fase 1 (diário): ${unitDocs.length} atendimentos concluídos`)

      // ── Phase 2: TCC minimums ────────────────────────────────────────

      const pickLeastLoadedDay = (): Date | null => {
        let best: Date | null = null
        let bestCount = Infinity
        for (const d of calendarDays) {
          if (isSameCalendarDay(d, todayStart)) continue
          const c = countByDay.get(dayKey(d)) ?? 0
          if (c >= ABSOLUTE_MAX_PER_DAY) continue
          if (c < bestCount) {
            bestCount = c
            best = d
          }
        }
        return best
      }

      let tccAdded = 0

      for (const patientId of unitTccPatients) {
        while ((completedByPatient.get(String(patientId)) ?? 0) < TCC_MIN_COMPLETED_PER_PATIENT) {
          const day = pickLeastLoadedDay()
          if (!day) break
          if (!pushCompleted(day, { patientId, nurseId: nextNurse(), doctorId: nextDoctor() })) break
          tccAdded++
        }
      }

      for (const doctorId of unitTccDoctors) {
        while ((completedByDoctor.get(String(doctorId)) ?? 0) < TCC_MIN_COMPLETED_PER_DOCTOR) {
          const day = pickLeastLoadedDay()
          if (!day) break
          if (!pushCompleted(day, { patientId: nextPatient(), nurseId: nextNurse(), doctorId })) break
          tccAdded++
        }
      }

      for (const nurseId of unitTccNurses) {
        while ((completedByNurse.get(String(nurseId)) ?? 0) < TCC_MIN_COMPLETED_PER_NURSE) {
          const day = pickLeastLoadedDay()
          if (!day) break
          if (!pushCompleted(day, { patientId: nextPatient(), doctorId: nextDoctor(), nurseId })) break
          tccAdded++
        }
      }

      if (tccAdded > 0) {
        console.log(`   🎓 Fase 2 (TCC mínimos): +${tccAdded} concluídos`)
      }

      // ── Phase 3: today's active attendances ──────────────────────────

      const todayKey = dayKey(todayStart)
      const todayCurrentCount = () => countByDay.get(todayKey) ?? 0

      const pushActive = (
        targetStatus: AttendanceStatus,
        opts: {
          patientId?: Types.ObjectId
          nurseId?: Types.ObjectId
          doctorId?: Types.ObjectId
        } = {}
      ): boolean => {
        if (todayCurrentCount() >= TODAY_TOTAL_CAP) return false

        const risk = pickRisk()
        const minutesAgo = faker.number.int({ min: 10, max: 180 })
        const endTime = new Date(now.getTime() - minutesAgo * 60_000)
        const built = buildActiveFlow(endTime, risk, targetStatus)

        if (built.date.getTime() < todayStart.getTime()) {
          return false
        }

        const patientId = opts.patientId ?? nextPatient()
        const diseaseProfile = pickDiseaseProfile()
        const symptoms = buildSymptoms(built.status, diseaseProfile)
        const complaint =
          symptoms?.length ? pickComplaintFromSymptoms(symptoms) : faker.helpers.arrayElement(COMPLAINTS)

        const needsNurse =
          built.status !== AttendanceStatus.ON_THE_WAY &&
          built.status !== AttendanceStatus.WAITING_TRIAGE
        const needsDoctor =
          built.status === AttendanceStatus.IN_ATTENDANCE ||
          built.status === AttendanceStatus.ATTENDANCE_COMPLETED

        const nurseId =
          needsNurse ? (opts.nurseId ?? nextNurse()) : undefined
        const doctorId =
          needsDoctor ? (opts.doctorId ?? nextDoctor()) : undefined

        const lastAt = built.history[built.history.length - 1]?.changedAt ?? endTime

        const selfMedicated = faker.datatype.boolean({
          probability: risk === AttendanceRisk.NOT_URGENT ? 0.4 : 0.15
        })

        const doc = assembleSeed({
          number: attendanceNumber++,
          complaint,
          date: built.date,
          risk,
          status: built.status,
          unitId: pool.unitId,
          patientId,
          nurseId,
          doctorId,
          changesHistory: built.history,
          createdAt: built.date,
          updatedAt: lastAt,
          symptoms,
          selfMedicated,
          symptomStartDate: new Date(
            built.date.getTime() - faker.number.int({ min: 1, max: 5 }) * 86_400_000
          ),
          generalObservation: faker.datatype.boolean({ probability: 0.3 })
            ? faker.helpers.arrayElement(OBSERVATIONS)
            : undefined,
          conditions: faker.helpers.arrayElements(CONDITIONS_POOL, { min: 0, max: 2 }),
          allergies: faker.helpers.arrayElements(ALLERGIES_POOL, { min: 0, max: 2 })
        })

        unitDocs.push(doc)
        countByDay.set(todayKey, todayCurrentCount() + 1)
        return true
      }

      const usedActivePatients = new Set<string>()
      const safeNextPatient = () => {
        for (let attempt = 0; attempt < pool.patients.length; attempt++) {
          const id = nextPatient()
          if (!usedActivePatients.has(String(id))) {
            usedActivePatients.add(String(id))
            return id
          }
        }
        return nextPatient()
      }

      if (pool.patients.length < MIN_QUEUE_WAITING_TRIAGE + MIN_QUEUE_WAITING_ATTENDANCE + 20) {
        await ensurePatients(pool, MIN_QUEUE_WAITING_TRIAGE + MIN_QUEUE_WAITING_ATTENDANCE + 30)
      }

      let activeCount = 0

      for (let i = 0; i < MIN_QUEUE_WAITING_TRIAGE; i++) {
        if (pushActive(AttendanceStatus.WAITING_TRIAGE, { patientId: safeNextPatient() })) {
          activeCount++
        }
      }

      for (let i = 0; i < MIN_QUEUE_WAITING_ATTENDANCE; i++) {
        if (pushActive(AttendanceStatus.WAITING_ATTENDANCE, { patientId: safeNextPatient() })) {
          activeCount++
        }
      }

      for (const doctorId of unitTccDoctors) {
        for (let i = 0; i < TCC_ACTIVE_PER_DOCTOR; i++) {
          if (
            pushActive(AttendanceStatus.IN_ATTENDANCE, {
              patientId: safeNextPatient(),
              nurseId: nextNurse(),
              doctorId
            })
          ) {
            activeCount++
          }
        }
      }

      for (const nurseId of unitTccNurses) {
        for (let i = 0; i < TCC_ACTIVE_PER_NURSE; i++) {
          if (
            pushActive(AttendanceStatus.IN_TRIAGE, {
              patientId: safeNextPatient(),
              nurseId
            })
          ) {
            activeCount++
          }
        }
      }

      const extraActiveTargets: AttendanceStatus[] = [
        AttendanceStatus.ON_THE_WAY,
        AttendanceStatus.ON_THE_WAY,
        AttendanceStatus.WAITING_TRIAGE,
        AttendanceStatus.IN_TRIAGE,
        AttendanceStatus.WAITING_ATTENDANCE,
        AttendanceStatus.IN_ATTENDANCE,
        AttendanceStatus.IN_ATTENDANCE
      ]
      for (const st of extraActiveTargets) {
        if (pushActive(st, { patientId: safeNextPatient() })) {
          activeCount++
        }
      }

      console.log(`   🔄 Fase 3 (ativos hoje): ${activeCount} atendimentos em andamento`)
      console.log(`   → Total unidade: ${unitDocs.length} — inserindo em lotes de ${INSERT_BATCH_SIZE}…`)

      await insertBatched(unitDocs)
    }

    // ── Summary ─────────────────────────────────────────────────────────

    const total = await Attendance.countDocuments()
    console.log(`\n✅ Total no banco: ${total} atendimento(s)`)

    for (const pool of unitPools) {
      const n = await Attendance.countDocuments({ unitId: pool.unitId })
      console.log(`   ${pool.unitName}: ${n}`)
    }

    console.log('\n✅ Script concluído.')
    process.exit(0)
  }
}

export default createAttendances
