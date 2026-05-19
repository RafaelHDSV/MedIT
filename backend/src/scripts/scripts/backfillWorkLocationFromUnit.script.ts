import { Doctor } from '../../models/DoctorModel.js'
import { Nurse } from '../../models/NurseModel.js'
import { UserLevels } from '../../interfaces/IUser.js'
import { sanitizeWorkLocationLabel } from '../../utils/sanitizeWorkLocationLabel.js'
import { Script } from '../types.js'

const DOCTOR_ROOM_RE = /consult[oó]rio\s*(\d+)/i
const NURSE_ROOM_RE = /triagem\s*(\d+)/i
const DOCTOR_CANONICAL_RE = /^Consult[oó]rio\s+\d+$/i
const NURSE_CANONICAL_RE = /^Sala triagem\s+\d+$/i

type ProfessionalLevel = typeof UserLevels.DOCTOR | typeof UserLevels.NURSE

function roomKey(unitId: unknown, level: string): string {
  return `${unitId ? String(unitId) : '__none__'}:${level}`
}

function parseRoomNumber(label: string, level: ProfessionalLevel): number | null {
  const re = level === UserLevels.DOCTOR ? DOCTOR_ROOM_RE : NURSE_ROOM_RE
  const match = label.match(re)
  if (!match) return null
  const n = Number.parseInt(match[1], 10)
  return Number.isFinite(n) ? n : null
}

function roomLabel(level: ProfessionalLevel, roomNum: number): string {
  if (level === UserLevels.DOCTOR) {
    return sanitizeWorkLocationLabel(`Consultório ${roomNum}`)
  }
  return sanitizeWorkLocationLabel(`Sala triagem ${roomNum}`)
}

function isCanonicalLabel(label: string, level: ProfessionalLevel): boolean {
  if (level === UserLevels.DOCTOR) {
    return DOCTOR_CANONICAL_RE.test(label)
  }
  return NURSE_CANONICAL_RE.test(label)
}

function isDryRun(): boolean {
  const v = process.env.BACKFILL_WORK_LOCATION_DRY_RUN
  return v === '1' || v === 'true'
}

type BackfillStats = {
  examined: number
  skippedHasLabel: number
  skippedNoChange: number
  updated: number
  normalized: number
}

async function seedDoctorRoomCounters(
  nextRoomByUnitLevel: Map<string, number>
) {
  const withLabel = await Doctor.find({
    workLocationLabel: { $exists: true, $nin: [null, ''] }
  })
    .select('unitId workLocationLabel')
    .lean()

  for (const doc of withLabel) {
    const label = sanitizeWorkLocationLabel(doc.workLocationLabel ?? '')
    if (!label) continue
    const num = parseRoomNumber(label, UserLevels.DOCTOR)
    if (num == null) continue
    const key = roomKey(doc.unitId, UserLevels.DOCTOR)
    nextRoomByUnitLevel.set(key, Math.max(nextRoomByUnitLevel.get(key) ?? 0, num))
  }
}

async function seedNurseRoomCounters(nextRoomByUnitLevel: Map<string, number>) {
  const withLabel = await Nurse.find({
    workLocationLabel: { $exists: true, $nin: [null, ''] }
  })
    .select('unitId workLocationLabel')
    .lean()

  for (const doc of withLabel) {
    const label = sanitizeWorkLocationLabel(doc.workLocationLabel ?? '')
    if (!label) continue
    const num = parseRoomNumber(label, UserLevels.NURSE)
    if (num == null) continue
    const key = roomKey(doc.unitId, UserLevels.NURSE)
    nextRoomByUnitLevel.set(key, Math.max(nextRoomByUnitLevel.get(key) ?? 0, num))
  }
}

async function backfillDoctors(
  nextRoomByUnitLevel: Map<string, number>,
  dryRun: boolean
): Promise<BackfillStats> {
  const level = UserLevels.DOCTOR
  const takeNextRoom = (unitId: unknown): number => {
    const key = roomKey(unitId, level)
    const next = (nextRoomByUnitLevel.get(key) ?? 0) + 1
    nextRoomByUnitLevel.set(key, next)
    return next
  }

  const cursor = Doctor.find({}).cursor()
  let examined = 0
  let skippedHasLabel = 0
  let skippedNoChange = 0
  let updated = 0
  let normalized = 0

  for await (const doc of cursor) {
    examined += 1
    const current = sanitizeWorkLocationLabel(doc.workLocationLabel ?? '')

    if (current && isCanonicalLabel(current, level)) {
      skippedHasLabel += 1
      continue
    }

    const parsed = current ? parseRoomNumber(current, level) : null
    const roomNum = parsed ?? takeNextRoom(doc.unitId)
    const label = roomLabel(level, roomNum)

    if (!label) {
      skippedNoChange += 1
      continue
    }

    if (current && parsed != null) {
      normalized += 1
    }

    if (dryRun) {
      console.log(
        `  [dry-run] medico ${doc.email}: "${current || '(vazio)'}" -> "${label}"`
      )
      updated += 1
      continue
    }

    const result = await Doctor.updateOne(
      { _id: doc._id },
      { $set: { workLocationLabel: label } }
    )

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      console.warn(`  [aviso] medico nao encontrado: ${doc._id}`)
      continue
    }

    updated += 1
  }

  return { examined, skippedHasLabel, skippedNoChange, updated, normalized }
}

async function backfillNurses(
  nextRoomByUnitLevel: Map<string, number>,
  dryRun: boolean
): Promise<BackfillStats> {
  const level = UserLevels.NURSE
  const takeNextRoom = (unitId: unknown): number => {
    const key = roomKey(unitId, level)
    const next = (nextRoomByUnitLevel.get(key) ?? 0) + 1
    nextRoomByUnitLevel.set(key, next)
    return next
  }

  const cursor = Nurse.find({}).cursor()
  let examined = 0
  let skippedHasLabel = 0
  let skippedNoChange = 0
  let updated = 0
  let normalized = 0

  for await (const doc of cursor) {
    examined += 1
    const current = sanitizeWorkLocationLabel(doc.workLocationLabel ?? '')

    if (current && isCanonicalLabel(current, level)) {
      skippedHasLabel += 1
      continue
    }

    const parsed = current ? parseRoomNumber(current, level) : null
    const roomNum = parsed ?? takeNextRoom(doc.unitId)
    const label = roomLabel(level, roomNum)

    if (!label) {
      skippedNoChange += 1
      continue
    }

    if (current && parsed != null) {
      normalized += 1
    }

    if (dryRun) {
      console.log(
        `  [dry-run] enfermeiro ${doc.email}: "${current || '(vazio)'}" -> "${label}"`
      )
      updated += 1
      continue
    }

    const result = await Nurse.updateOne(
      { _id: doc._id },
      { $set: { workLocationLabel: label } }
    )

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      console.warn(`  [aviso] enfermeiro nao encontrado: ${doc._id}`)
      continue
    }

    updated += 1
  }

  return { examined, skippedHasLabel, skippedNoChange, updated, normalized }
}

const backfillWorkLocationFromUnit: Script = {
  name: 'backfill-work-location-from-unit',
  description:
    'Preenche ou normaliza workLocationLabel (ex.: Consultorio 1, Sala triagem 2) sem nome da unidade',

  async run() {
    const dryRun = isDryRun()

    const doctorRooms = new Map<string, number>()
    const nurseRooms = new Map<string, number>()
    await seedDoctorRoomCounters(doctorRooms)
    await seedNurseRoomCounters(nurseRooms)

    console.log('Medicos...')
    const doctors = await backfillDoctors(doctorRooms, dryRun)

    console.log('Enfermeiros...')
    const nurses = await backfillNurses(nurseRooms, dryRun)

    const examined = doctors.examined + nurses.examined
    const skippedHasLabel = doctors.skippedHasLabel + nurses.skippedHasLabel
    const skippedNoChange = doctors.skippedNoChange + nurses.skippedNoChange
    const updated = doctors.updated + nurses.updated
    const normalized = doctors.normalized + nurses.normalized

    console.log('\nResumo:')
    console.log(`  Medicos examinados:        ${doctors.examined}`)
    console.log(`  Enfermeiros examinados:  ${nurses.examined}`)
    console.log(`  Total examinados:          ${examined}`)
    console.log(`  Ja no formato curto:       ${skippedHasLabel}`)
    console.log(`  Normalizados (tinham num): ${normalized}`)
    console.log(`  Sem alteracao:             ${skippedNoChange}`)
    console.log(
      dryRun
        ? `  Seriam atualizados:       ${updated}`
        : `  Atualizados:              ${updated}`
    )
    if (dryRun) {
      console.log(
        '\n(dry-run: nenhuma escrita; remova BACKFILL_WORK_LOCATION_DRY_RUN para aplicar)\n'
      )
    } else if (updated > 0) {
      console.log(
        '\nFormato: apenas "Consultorio N" ou "Sala triagem N" (sem nome da unidade).\n'
      )
    }
  }
}

export default backfillWorkLocationFromUnit
