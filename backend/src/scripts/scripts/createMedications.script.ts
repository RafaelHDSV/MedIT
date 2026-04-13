import { Types } from 'mongoose'
import {
  MedicationAvailabilityStatus,
  MedicationCategories
} from '../../interfaces/IMedications.js'
import MedicationModel from '../../models/MedicationModel.js'
import { Script } from '../types.js'

const UNIT_IDS = [
  '69d2981909395bf057e050e6', // UBS Vila Hortência
  '69d2981909395bf057e050ee', // UBS Márcia Mendes
  '69d2981909395bf057e050f6', // UBS Vila Barão
  '69d2981909395bf057e050fd', // UBS Éden
  '69d2981909395bf057e05105', // UBS Wanel Ville
  '69d2981909395bf057e0510c', // UPA 24h Zona Norte
  '69d2981909395bf057e05115', // UPA 24h Zona Sul
  '69d2981909395bf057e0511e', // Hospital Regional de Sorocaba
  '69d2981909395bf057e05127', // Amhemed Sorocaba
  '69d2981909395bf057e05130', // Centro de Especialidades Médicas de Sorocaba
  '69d2981909395bf057e05137', // UBS Parque São Bento
  '69d2981909395bf057e0513f' // UBS Aparecidinha
]

type UnitProfile = 'ubs' | 'upa' | 'hospital' | 'especialidades'

const UNIT_PROFILE: Record<string, UnitProfile> = {
  '69d2981909395bf057e050e6': 'ubs',
  '69d2981909395bf057e050ee': 'ubs',
  '69d2981909395bf057e050f6': 'ubs',
  '69d2981909395bf057e050fd': 'ubs',
  '69d2981909395bf057e05105': 'ubs',
  '69d2981909395bf057e0510c': 'upa',
  '69d2981909395bf057e05115': 'upa',
  '69d2981909395bf057e0511e': 'hospital',
  '69d2981909395bf057e05127': 'hospital',
  '69d2981909395bf057e05130': 'especialidades',
  '69d2981909395bf057e05137': 'ubs',
  '69d2981909395bf057e0513f': 'ubs'
}

const STOCK_RANGE: Record<UnitProfile, { min: number; max: number }> = {
  ubs: { min: 0, max: 300 },
  upa: { min: 0, max: 800 },
  hospital: { min: 0, max: 2000 },
  especialidades: { min: 0, max: 500 }
}

const FORCED_UNAVAILABLE_COUNT = 5

// Categorias restritas por perfil de unidade
// Medicamentos não listados aqui ficam disponíveis em todos os perfis
const PROFILE_BLOCKLIST: Partial<Record<UnitProfile, MedicationCategories[]>> =
  {
    ubs: [MedicationCategories.ANTIVENOMS],
    especialidades: [MedicationCategories.ANTIVENOMS]
  }

// Medicamentos individuais restritos por nome (para casos que a categoria é ampla demais)
const NAME_BLOCKLIST: Partial<Record<UnitProfile, string[]>> = {
  ubs: [
    'Morfina 10mg/mL solução injetável',
    'Anfotericina B 50mg pó para solução injetável'
  ],
  especialidades: [
    'Morfina 10mg/mL solução injetável',
    'Haloperidol 5mg/mL solução injetável'
  ]
}

function isAllowedForProfile(
  med: MedicationTemplate,
  profile: UnitProfile
): boolean {
  const blockedCategories = PROFILE_BLOCKLIST[profile] ?? []
  if (blockedCategories.includes(med.category)) return false

  const blockedNames = NAME_BLOCKLIST[profile] ?? []
  if (blockedNames.includes(med.name)) return false

  return true
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function resolveStatus(qty: number): MedicationAvailabilityStatus {
  if (qty === 0) return MedicationAvailabilityStatus.UNAVAILABLE
  if (qty <= 50) return MedicationAvailabilityStatus.LOW_STOCK
  return MedicationAvailabilityStatus.AVAILABLE
}

/**
 * Retorna índices distribuídos uniformemente para slots zerados.
 * O parâmetro `offset` rotaciona o ponto de início a cada unidade,
 * garantindo que unidades diferentes tenham medicamentos indisponíveis
 * em posições diferentes do catálogo.
 *
 * Exemplo com 48 meds, count=5, step=9:
 *   offset=0 → índices: 0, 9, 18, 27, 36
 *   offset=1 → índices: 1, 10, 19, 28, 37
 *   offset=2 → índices: 2, 11, 20, 29, 38
 */
function unavailableIndexes(
  total: number,
  count: number,
  offset: number
): Set<number> {
  const step = Math.floor(total / count)
  const indexes = new Set<number>()
  for (let i = 0; i < count; i++) {
    indexes.add((i * step + offset) % total)
  }
  return indexes
}

interface MedicationTemplate {
  name: string
  category: MedicationCategories
  description: string
  requiresPrescription: boolean
}

const MEDICATIONS: MedicationTemplate[] = [
  // ── ANALGÉSICOS
  {
    name: 'Paracetamol 500mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Analgésico e antipirético. Indicado para dor leve a moderada e febre.',
    requiresPrescription: false
  },
  {
    name: 'Dipirona Sódica 500mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description: 'Analgésico e antipirético de uso oral.',
    requiresPrescription: false
  },
  {
    name: 'Dipirona Sódica 500mg/mL solução injetável',
    category: MedicationCategories.ANALGESICS,
    description: 'Analgésico e antipirético para uso IV ou IM.',
    requiresPrescription: true
  },
  {
    name: 'Ibuprofeno 600mg comprimido revestido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Anti-inflamatório não esteroidal com ação analgésica e antipirética.',
    requiresPrescription: false
  },
  {
    name: 'Tramadol 50mg cápsula',
    category: MedicationCategories.ANALGESICS,
    description: 'Opioide de ação central para dor moderada a intensa.',
    requiresPrescription: true
  },
  {
    name: 'Morfina 10mg/mL solução injetável',
    category: MedicationCategories.ANALGESICS,
    description: 'Opioide potente para dor intensa. Uso hospitalar.',
    requiresPrescription: true
  },
  {
    name: 'Codeína 30mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description: 'Opioide de potência intermediária para dor moderada.',
    requiresPrescription: true
  },
  {
    name: 'Cetoprofeno 100mg cápsula',
    category: MedicationCategories.ANALGESICS,
    description: 'AINE para artrite, dismenorreia e dor pós-operatória.',
    requiresPrescription: false
  },
  {
    name: 'Diclofenaco Sódico 50mg comprimido revestido',
    category: MedicationCategories.ANALGESICS,
    description: 'AINE para dor e inflamação musculoesquelética.',
    requiresPrescription: false
  },
  {
    name: 'Ácido Acetilsalicílico 500mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description: 'Analgésico, antipirético e antiagregante plaquetário.',
    requiresPrescription: false
  },
  // ── ANTIBIÓTICOS
  {
    name: 'Amoxicilina 500mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Antibiótico betalactâmico de amplo espectro.',
    requiresPrescription: true
  },
  {
    name: 'Amoxicilina + Clavulanato 875mg + 125mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Betalactâmico com inibidor de betalactamase.',
    requiresPrescription: true
  },
  {
    name: 'Azitromicina 500mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Macrolídeo para infecções respiratórias e pneumonia comunitária.',
    requiresPrescription: true
  },
  {
    name: 'Ciprofloxacino 500mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Fluoroquinolona de amplo espectro.',
    requiresPrescription: true
  },
  {
    name: 'Metronidazol 400mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Antibiótico e antiprotozoário para infecções anaeróbias.',
    requiresPrescription: true
  },
  {
    name: 'Cefalexina 500mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Cefalosporina 1ª geração para infecções de pele e trato urinário.',
    requiresPrescription: true
  },
  {
    name: 'Clindamicina 300mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Lincosamida para infecções graves por anaeróbios.',
    requiresPrescription: true
  },
  {
    name: 'Doxiciclina 100mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Tetraciclina para leptospirose, clamídia e acne grave.',
    requiresPrescription: true
  },
  {
    name: 'Sulfametoxazol + Trimetoprima 400mg + 80mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Sulfonamida para ITU e pneumocistose.',
    requiresPrescription: true
  },
  {
    name: 'Gentamicina 80mg/2mL solução injetável',
    category: MedicationCategories.ANTIBIOTICS,
    description: 'Aminoglicosídeo parenteral para gram-negativos graves.',
    requiresPrescription: true
  },
  // ── ANTIVIRAIS
  {
    name: 'Aciclovir 400mg comprimido',
    category: MedicationCategories.ANTIVIRALS,
    description: 'Antiviral para herpes simples e zóster.',
    requiresPrescription: true
  },
  {
    name: 'Aciclovir 250mg pó para solução injetável',
    category: MedicationCategories.ANTIVIRALS,
    description:
      'Antiviral IV para casos graves de herpes em imunossuprimidos.',
    requiresPrescription: true
  },
  {
    name: 'Oseltamivir 75mg cápsula',
    category: MedicationCategories.ANTIVIRALS,
    description: 'Inibidor de neuraminidase para influenza A e B.',
    requiresPrescription: true
  },
  {
    name: 'Tenofovir Disoproxila 300mg comprimido',
    category: MedicationCategories.ANTIVIRALS,
    description: 'Antirretroviral para HIV e hepatite B.',
    requiresPrescription: true
  },
  {
    name: 'Lamivudina 150mg comprimido',
    category: MedicationCategories.ANTIVIRALS,
    description: 'Análogo de nucleosídeo para HIV e hepatite B.',
    requiresPrescription: true
  },
  // ── ANTIFÚNGICOS
  {
    name: 'Fluconazol 150mg cápsula',
    category: MedicationCategories.ANTIFUNGALS,
    description: 'Triazólico dose única para candidíase vulvovaginal.',
    requiresPrescription: true
  },
  {
    name: 'Fluconazol 2mg/mL solução para infusão',
    category: MedicationCategories.ANTIFUNGALS,
    description: 'Antifúngico IV para candidemia e meningite criptocócica.',
    requiresPrescription: true
  },
  {
    name: 'Nistatina 100.000 UI/mL suspensão oral',
    category: MedicationCategories.ANTIFUNGALS,
    description: 'Antifúngico tópico oral para candidíase orofaríngea.',
    requiresPrescription: false
  },
  {
    name: 'Cetoconazol 200mg comprimido',
    category: MedicationCategories.ANTIFUNGALS,
    description: 'Imidazólico para dermatofitoses e candidíase mucocutânea.',
    requiresPrescription: true
  },
  {
    name: 'Anfotericina B 50mg pó para solução injetável',
    category: MedicationCategories.ANTIFUNGALS,
    description:
      'Antifúngico para infecções sistêmicas graves. Uso hospitalar estrito.',
    requiresPrescription: true
  },
  // ── ANTICONVULSIVANTES
  {
    name: 'Fenitoína 100mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description: 'Antiepiléptico para crises tônico-clônicas e parciais.',
    requiresPrescription: true
  },
  {
    name: 'Carbamazepina 200mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description:
      'Antiepiléptico para epilepsia parcial e neuralgia do trigêmeo.',
    requiresPrescription: true
  },
  {
    name: 'Valproato de Sódio 500mg comprimido revestido',
    category: MedicationCategories.ANTICONVULSANTS,
    description: 'Antiepiléptico de amplo espectro e profilaxia de enxaqueca.',
    requiresPrescription: true
  },
  {
    name: 'Fenobarbital 100mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description: 'Barbitúrico anticonvulsivante de longa duração.',
    requiresPrescription: true
  },
  {
    name: 'Lamotrigina 100mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description: 'Antiepiléptico para epilepsia parcial e transtorno bipolar.',
    requiresPrescription: true
  },
  // ── ANTIDEPRESSIVOS
  {
    name: 'Fluoxetina 20mg cápsula',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description: 'ISRS para depressão maior, TOC e bulimia.',
    requiresPrescription: true
  },
  {
    name: 'Sertralina 50mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description: 'ISRS para depressão, pânico, fobia social e TOC.',
    requiresPrescription: true
  },
  {
    name: 'Escitalopram 10mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description:
      'ISRS de alta seletividade para depressão e ansiedade generalizada.',
    requiresPrescription: true
  },
  {
    name: 'Amitriptilina 25mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description: 'Tricíclico para depressão, dor neuropática e enxaqueca.',
    requiresPrescription: true
  },
  {
    name: 'Imipramina 25mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description: 'Tricíclico para depressão maior e enurese noturna.',
    requiresPrescription: true
  },
  // ── ANTIPSICÓTICOS
  {
    name: 'Haloperidol 5mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico típico para esquizofrenia e agitação psicomotora.',
    requiresPrescription: true
  },
  {
    name: 'Haloperidol 5mg/mL solução injetável',
    category: MedicationCategories.ANTIPSICOTICOS,
    description: 'Haloperidol parenteral para agitação intensa hospitalar.',
    requiresPrescription: true
  },
  {
    name: 'Risperidona 2mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico atípico para esquizofrenia e transtorno bipolar.',
    requiresPrescription: true
  },
  {
    name: 'Quetiapina 200mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico atípico para esquizofrenia e episódios bipolares.',
    requiresPrescription: true
  },
  {
    name: 'Olanzapina 10mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico atípico com monitoramento de glicemia recomendado.',
    requiresPrescription: true
  },
  // ── ANTISSÉPTICOS
  {
    name: 'Clorexidina 0,12% solução para bochecho',
    category: MedicationCategories.ANTISEPTICS,
    description: 'Antisséptico bucal para placa bacteriana e gengivite.',
    requiresPrescription: false
  },
  {
    name: 'Povidona Iodada 10% solução tópica',
    category: MedicationCategories.ANTISEPTICS,
    description:
      'Antisséptico tópico para limpeza de feridas e campo cirúrgico.',
    requiresPrescription: false
  },
  {
    name: 'Álcool Etílico 70% solução',
    category: MedicationCategories.ANTISEPTICS,
    description:
      'Antisséptico para higiene das mãos e descontaminação de superfícies.',
    requiresPrescription: false
  },
  // ── ANTIVENENOS
  {
    name: 'Soro Antibotrópico liofilizado (10 ampolas)',
    category: MedicationCategories.ANTIVENOMS,
    description:
      'Imunoglobulinas para neutralização de veneno de Bothrops. Uso hospitalar.',
    requiresPrescription: true
  },
  {
    name: 'Soro Antiaracnídico liofilizado (5 ampolas)',
    category: MedicationCategories.ANTIVENOMS,
    description:
      'Imunoglobulinas para venenos de escorpiões e aranhas. Uso hospitalar.',
    requiresPrescription: true
  },
  // ── OUTROS
  {
    name: 'Omeprazol 20mg cápsula',
    category: MedicationCategories.OTHER,
    description: 'Inibidor de bomba de prótons para úlcera e DRGE.',
    requiresPrescription: false
  },
  {
    name: 'Metformina 850mg comprimido',
    category: MedicationCategories.OTHER,
    description: 'Biguanida antidiabética primeira escolha no DM2.',
    requiresPrescription: true
  },
  {
    name: 'Enalapril 10mg comprimido',
    category: MedicationCategories.OTHER,
    description: 'Inibidor da ECA para hipertensão e insuficiência cardíaca.',
    requiresPrescription: true
  },
  {
    name: 'Losartana Potássica 50mg comprimido',
    category: MedicationCategories.OTHER,
    description:
      'Antagonista da angiotensina II para hipertensão e nefropatia diabética.',
    requiresPrescription: true
  },
  {
    name: 'Sinvastatina 40mg comprimido',
    category: MedicationCategories.OTHER,
    description: 'Estatina para dislipidemia e prevenção cardiovascular.',
    requiresPrescription: true
  },
  {
    name: 'Salbutamol 100mcg/dose aerossol',
    category: MedicationCategories.OTHER,
    description: 'Broncodilatador beta-2 de curta duração para asma e DPOC.',
    requiresPrescription: true
  },
  {
    name: 'Dexametasona 4mg/mL solução injetável',
    category: MedicationCategories.OTHER,
    description:
      'Corticosteroide para choque anafilático e crises asmáticas graves.',
    requiresPrescription: true
  },
  {
    name: 'Hidroclorotiazida 25mg comprimido',
    category: MedicationCategories.OTHER,
    description: 'Diurético tiazídico para hipertensão e edema cardíaco.',
    requiresPrescription: true
  }
]

const seedMedications: Script = {
  name: 'create-medications',
  description:
    'Insere medicamentos reais em cada unidade com catálogo e disponibilidade variados por perfil',
  async run() {
    console.log('Deletando os medicamentos já existentes')
    const removed = await MedicationModel.deleteMany({})
    console.log(`Foram deletados ${removed.deletedCount} medicamentos\n`)

    console.log(
      `Iniciando seed de ${MEDICATIONS.length} medicamentos em ${UNIT_IDS.length} unidades...\n`
    )

    let totalInserted = 0
    let totalErrors = 0

    for (let u = 0; u < UNIT_IDS.length; u++) {
      const unitId = UNIT_IDS[u]
      const profile = UNIT_PROFILE[unitId]
      const { min, max } = STOCK_RANGE[profile]

      // Filtra medicamentos permitidos para este perfil de unidade
      const allowedMeds = MEDICATIONS.filter((m) =>
        isAllowedForProfile(m, profile)
      )

      // Índices zerados rotacionados pelo índice da unidade → cada unidade
      // tem medicamentos indisponíveis em posições distintas do catálogo
      const forcedUnavailable = unavailableIndexes(
        allowedMeds.length,
        FORCED_UNAVAILABLE_COUNT,
        u
      )

      console.log(
        `Unidade ${unitId} [${profile}] — ${allowedMeds.length} medicamentos, indisponíveis nos índices: [${[...forcedUnavailable].sort((a, b) => a - b).join(', ')}]`
      )

      for (let i = 0; i < allowedMeds.length; i++) {
        const template = allowedMeds[i]

        try {
          let stockQuantity: number

          if (forcedUnavailable.has(i)) {
            stockQuantity = 0
          } else {
            const isControlled =
              template.category === MedicationCategories.ANTIVENOMS ||
              template.name.toLowerCase().includes('morfina')

            const stockMin = isControlled
              ? Math.max(1, Math.floor(min / 10))
              : min
            const stockMax = isControlled
              ? Math.max(5, Math.floor(max / 10))
              : max

            stockQuantity = Math.max(1, randomInt(stockMin, stockMax))
          }

          const availabilityStatus = resolveStatus(stockQuantity)

          await MedicationModel.create({
            name: template.name,
            category: template.category,
            description: template.description,
            requiresPrescription: template.requiresPrescription,
            availabilityStatus,
            stockQuantity,
            unitId: new Types.ObjectId(unitId)
          })

          console.log(
            `  ✅ ${template.name} — estoque: ${stockQuantity} [${availabilityStatus}]`
          )
          totalInserted++
        } catch (err) {
          console.error(`  ❌ Erro ao inserir "${template.name}":`, err)
          totalErrors++
        }
      }

      console.log()
    }

    console.log('─────────────────────────────────────────')
    console.log(`✅ Inseridos : ${totalInserted}`)
    console.log(`❌ Erros     : ${totalErrors}`)
    console.log('─────────────────────────────────────────')
    process.exit(0)
  }
}

export default seedMedications
