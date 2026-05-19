import User from '../../models/UserModel.js'
import { Unit } from '../../models/UnitModel.js'
import { UserLevels } from '../../interfaces/IUser.js'
import { sanitizeWorkLocationLabel } from '../../utils/sanitizeWorkLocationLabel.js'
import { Script } from '../types.js'

const DOCTOR_ROOM_RE = /consult[oó]rio\s*(\d+)/i
const NURSE_ROOM_RE = /triagem\s*(\d+)/i

function roomKey(unitId: unknown, level: string): string {
  return `${unitId ? String(unitId) : '__none__'}:${level}`
}

function parseRoomNumber(label: string, level: string): number | null {
  const re = level === UserLevels.DOCTOR ? DOCTOR_ROOM_RE : NURSE_ROOM_RE
  const match = label.match(re)
  if (!match) return null
  const n = Number.parseInt(match[1], 10)
  return Number.isFinite(n) ? n : null
}

function buildLabel(
  unitName: string | undefined,
  level: string,
  roomNum: number
): string {
  const base = (unitName?.trim() || 'Unidade').slice(0, 60)
  if (level === UserLevels.DOCTOR) {
    return sanitizeWorkLocationLabel(`${base} - Consultório ${roomNum}`)
  }
  return sanitizeWorkLocationLabel(`${base} - Sala triagem ${roomNum}`)
}

function fallbackLabel(level: string, roomNum: number): string {
  if (level === UserLevels.DOCTOR) {
    return sanitizeWorkLocationLabel(`Consultório ${roomNum}`)
  }
  return sanitizeWorkLocationLabel(`Sala triagem ${roomNum}`)
}

function isDryRun(): boolean {
  const v = process.env.BACKFILL_WORK_LOCATION_DRY_RUN
  return v === '1' || v === 'true'
}

const backfillWorkLocationFromUnit: Script = {
  name: 'backfill-work-location-from-unit',
  description:
    'Preenche workLocationLabel (vazio) de medicos e enfermeiros com sala/consultorio numerado por unidade',

  async run() {
    const dryRun = isDryRun()

    const units = await Unit.find().select('_id name').lean()
    const nameByUnitId = new Map<string, string>()
    for (const u of units) {
      nameByUnitId.set(String(u._id), u.name ?? '')
    }

    /** Proximo numero de sala por unidade + nivel (evita duplicar Consultorio 1 para todos). */
    const nextRoomByUnitLevel = new Map<string, number>()

    const withLabel = await User.find({
      level: { $in: [UserLevels.DOCTOR, UserLevels.NURSE] },
      workLocationLabel: { $exists: true, $ne: '' }
    })
      .select('unitId level workLocationLabel')
      .lean()

    for (const doc of withLabel) {
      const label = sanitizeWorkLocationLabel(
        (doc as { workLocationLabel?: string }).workLocationLabel ?? ''
      )
      if (!label) continue
      const num = parseRoomNumber(label, doc.level)
      if (num == null) continue
      const key = roomKey(doc.unitId, doc.level)
      nextRoomByUnitLevel.set(key, Math.max(nextRoomByUnitLevel.get(key) ?? 0, num))
    }

    const takeNextRoom = (unitId: unknown, level: string): number => {
      const key = roomKey(unitId, level)
      const next = (nextRoomByUnitLevel.get(key) ?? 0) + 1
      nextRoomByUnitLevel.set(key, next)
      return next
    }

    const cursor = User.find({
      level: { $in: [UserLevels.DOCTOR, UserLevels.NURSE] }
    }).cursor()

    let examined = 0
    let skippedHasLabel = 0
    let skippedNoChange = 0
    let updated = 0

    for await (const doc of cursor) {
      examined += 1
      const current = sanitizeWorkLocationLabel(
        (doc as { workLocationLabel?: string }).workLocationLabel ?? ''
      )
      if (current) {
        skippedHasLabel += 1
        continue
      }

      const level = doc.level
      const roomNum = takeNextRoom(doc.unitId, level)
      let label: string

      if (doc.unitId) {
        const idStr = String(doc.unitId)
        if (!nameByUnitId.has(idStr)) {
          console.warn(
            `  [aviso] ${doc.email} referencia unidade inexistente (${idStr}); usando nome generico.`
          )
        }
        const unitName = nameByUnitId.get(idStr)
        label = buildLabel(unitName, level, roomNum)
      } else {
        label = fallbackLabel(level, roomNum)
        console.warn(
          `  [aviso] ${doc.email} sem unitId — usando label: ${label}`
        )
      }

      if (!label) {
        skippedNoChange += 1
        continue
      }

      if (dryRun) {
        console.log(`  [dry-run] atualizaria ${doc.email} -> "${label}"`)
        updated += 1
        continue
      }

      await User.updateOne(
        { _id: doc._id },
        { $set: { workLocationLabel: label } }
      )
      updated += 1
    }

    console.log('\nResumo:')
    console.log(`  Examinados:             ${examined}`)
    console.log(`  Ja com label (pulados): ${skippedHasLabel}`)
    console.log(`  Sem alteracao:           ${skippedNoChange}`)
    console.log(
      dryRun
        ? `  Seriam atualizados:     ${updated}`
        : `  Atualizados:            ${updated}`
    )
    if (dryRun) {
      console.log(
        '\n(dry-run: nenhuma escrita; remova BACKFILL_WORK_LOCATION_DRY_RUN para aplicar)\n'
      )
    } else if (updated > 0) {
      console.log(
        '\nEx.: medico -> "UBS Centro - Consultório 3"; enfermeiro -> "UPA Norte - Sala triagem 2"\n'
      )
    }
  }
}

export default backfillWorkLocationFromUnit
