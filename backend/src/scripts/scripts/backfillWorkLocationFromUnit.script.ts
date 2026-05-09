import User from '../../models/UserModel.js'
import { Unit } from '../../models/UnitModel.js'
import { UserLevels } from '../../interfaces/IUser.js'
import { sanitizeWorkLocationLabel } from '../../utils/sanitizeWorkLocationLabel.js'
import { Script } from '../types.js'

function buildLabel(unitName: string | undefined, level: string): string {
  const base = (unitName?.trim() || 'Unidade').slice(0, 80)
  const suffix =
    level === UserLevels.DOCTOR ? 'Consultório' : 'Triagem'
  return sanitizeWorkLocationLabel(`${base} - ${suffix}`)
}

/** Usuarios sem unitId: texto generico ainda valido para cadastro/API. */
function fallbackLabel(level: string): string {
  const suffix =
    level === UserLevels.DOCTOR ? 'Consultório' : 'Triagem'
  return sanitizeWorkLocationLabel(`Unidade - ${suffix}`)
}

const backfillWorkLocationFromUnit: Script = {
  name: 'backfill-work-location-from-unit',
  description:
    'Preenche workLocationLabel (vazio) de medicos e enfermeiros a partir do nome da unidade',

  async run() {
    const dryRun =
      process.env.BACKFILL_WORK_LOCATION_DRY_RUN === '1' ||
      process.env.BACKFILL_WORK_LOCATION_DRY_RUN === 'true'

    const units = await Unit.find().select('_id name').lean()
    const nameByUnitId = new Map<string, string>()
    for (const u of units) {
      nameByUnitId.set(String(u._id), u.name ?? '')
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
      let label: string
      if (doc.unitId) {
        const idStr = String(doc.unitId)
        if (!nameByUnitId.has(idStr)) {
          console.warn(
            `  [aviso] ${doc.email} referencia unidade inexistente (${idStr}); usando nome generico.`
          )
        }
        const unitName = nameByUnitId.get(idStr)
        label = buildLabel(unitName, level)
        if (!label) {
          skippedNoChange += 1
          continue
        }
      } else {
        label = fallbackLabel(level)
        console.warn(
          `  [aviso] ${doc.email} sem unitId — usando label generica: ${label}`
        )
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
    console.log(`  Examinados:           ${examined}`)
    console.log(`  Ja com label (pulados): ${skippedHasLabel}`)
    console.log(`  Sem alteracao:         ${skippedNoChange}`)
    console.log(
      dryRun ? `  Seriam atualizados:   ${updated}` : `  Atualizados:          ${updated}`
    )
    if (dryRun) {
      console.log(
        '\n(dry-run: nenhuma escrita; remova BACKFILL_WORK_LOCATION_DRY_RUN para aplicar)\n'
      )
    }
  }
}

export default backfillWorkLocationFromUnit
