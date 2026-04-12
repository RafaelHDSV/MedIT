import { Types } from 'mongoose'
import { Unit } from '../../models/UnitModel.js'
import { Script } from '../types.js'

/**
 * Grupos de parceria definidos explicitamente por ID.
 *
 * Regras:
 *  - UBS/USF/CS → parceiras entre si (rede primária de atenção básica)
 *  - UPA/UPH    → parceiras entre si (rede de urgência)
 *  - Hospital e Especialidades → sem parceiras automáticas (parcerias
 *    institucionais são acordadas caso a caso e devem ser cadastradas
 *    manualmente via interface administrativa)
 *
 * Cada unidade recebe como partnerUnitIds todos os outros IDs do seu grupo
 * (excluindo ela mesma).
 */
const PARTNER_GROUPS: string[][] = [
  // Atenção Básica — UBS / USF / CS
  [
    '69d2981909395bf057e050e6', // CS Vila Hortência Sorocaba
    '69d2981909395bf057e050ee', // UBS Jardim Vera Cruz
    '69d2981909395bf057e050f6', // USF Vila Barão
    '69d2981909395bf057e050fd', // UBS Éden
    '69d2981909395bf057e05105', // UBS Wanel Ville
    '69d2981909395bf057e05137', // UBS Parque São Bento
    '69d2981909395bf057e0513f' // UBS Aparecidinha
  ],
  // Urgência — UPA / UPH
  [
    '69d2981909395bf057e0510c', // UPH 24h Zona Norte
    '69d2981909395bf057e05115' // UPH 24h Zona Sul
  ]
  // Hospital Regional de Sorocaba  → sem grupo (parceria manual)
  // Amhemed Sorocaba               → sem grupo (parceria manual)
  // Centro de Especialidades        → sem grupo (parceria manual)
]

const migratePartnerUnits: Script = {
  name: 'migrate-partner-units',
  description:
    'Popula o campo partnerUnitIds em todas as unidades com base nos grupos de parceria definidos',

  async run() {
    console.log('Iniciando migração de unidades parceiras...\n')

    // Zera o campo em todas as unidades antes de reescrever,
    // garantindo idempotência caso o script seja rodado mais de uma vez.
    await Unit.updateMany({}, { $set: { partnerUnitIds: [] } })
    console.log('Campo partnerUnitIds zerado em todas as unidades\n')

    let totalUpdated = 0
    let totalErrors = 0

    for (const group of PARTNER_GROUPS) {
      for (const unitId of group) {
        // Parceiras = todos do grupo exceto a própria unidade
        const partnerIds = group
          .filter((id) => id !== unitId)
          .map((id) => new Types.ObjectId(id))

        try {
          const result = await Unit.findByIdAndUpdate(
            unitId,
            { $set: { partnerUnitIds: partnerIds } },
            { new: false }
          )

          if (!result) {
            console.warn(`  ⚠️  Unidade não encontrada: ${unitId}`)
          } else {
            console.log(
              `  ✅ ${result.name} → ${partnerIds.length} parceira(s)`
            )
            totalUpdated++
          }
        } catch (err) {
          console.error(`  ❌ Erro ao atualizar ${unitId}:`, err)
          totalErrors++
        }
      }

      console.log()
    }

    console.log('─────────────────────────────────────────')
    console.log(`✅ Atualizadas : ${totalUpdated}`)
    console.log(`❌ Erros       : ${totalErrors}`)
    console.log('─────────────────────────────────────────')
    process.exit(0)
  }
}

export default migratePartnerUnits
