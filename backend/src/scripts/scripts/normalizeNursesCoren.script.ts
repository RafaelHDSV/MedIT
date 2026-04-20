import { Nurse } from '../../models/NurseModel.js'
import { Script } from '../types.js'

/**
 * Converte COREN legado (`COREN-UF NNN.NNN-TIPO`) para o formato do seed:
 * `NNNNNN/UF-TIPO`.
 */
function normalizeCorenString(coren: string): string | null {
  const t = coren.trim()
  if (!t) return null

  const canonical = t.match(/^(\d{4,9})\/([A-Za-z]{2})-([A-Za-z0-9]+)$/)
  if (canonical) {
    return `${canonical[1]}/${canonical[2].toUpperCase()}-${canonical[3].toUpperCase()}`
  }

  const legacy = t.match(/^COREN-([A-Za-z]{2})\s+([\d.\s]+?)-([A-Za-z0-9]+)$/i)
  if (legacy) {
    const digits = legacy[2].replace(/\D/g, '')
    if (digits.length < 4 || digits.length > 9) return null
    return `${digits}/${legacy[1].toUpperCase()}-${legacy[3].toUpperCase()}`
  }

  return null
}

const normalizeNursesCoren: Script = {
  name: 'normalize-nurses-coren',
  description:
    'Normaliza o campo coren dos enfermeiros para o formato ######/UF-TIPO',
  async run() {
    const nurses = await Nurse.find({}).select('_id name coren')

    let updated = 0
    let skipped = 0
    let failed = 0

    for (const n of nurses) {
      const next = normalizeCorenString(n.coren)
      if (!next) {
        console.warn(`⚠️  Ignorado (formato não reconhecido): ${n.name} — "${n.coren}"`)
        failed++
        continue
      }
      if (next === n.coren.trim()) {
        skipped++
        continue
      }

      await Nurse.updateOne({ _id: n._id }, { $set: { coren: next } })
      console.log(`✅ ${n.name}: "${n.coren}" → "${next}"`)
      updated++
    }

    console.log(
      `\nResumo: ${updated} atualizado(s), ${skipped} já no formato, ${failed} não reconhecido(s).`
    )
  }
}

export default normalizeNursesCoren
