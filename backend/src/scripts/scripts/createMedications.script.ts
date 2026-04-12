import { Types } from 'mongoose'
import {
  MedicationAvailabilityStatus,
  MedicationCategories
} from '../../interfaces/IMedications.js'
import MedicationModel from '../../models/MedicationModel.js'
import { Script } from '../types.js'

// IDs das unidades cadastradas no sistema
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

// Tipo de unidade para calibrar quantidades em estoque
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

// Faixas de estoque por perfil de unidade (min e max por medicamento)
const STOCK_RANGE: Record<UnitProfile, { min: number; max: number }> = {
  ubs: { min: 0, max: 300 },
  upa: { min: 0, max: 800 },
  hospital: { min: 0, max: 2000 },
  especialidades: { min: 0, max: 500 }
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function resolveStatus(
  qty: number,
  profile: UnitProfile
): MedicationAvailabilityStatus {
  if (qty === 0) return MedicationAvailabilityStatus.UNAVAILABLE
  if (qty <= 50) return MedicationAvailabilityStatus.LOW_STOCK
  return MedicationAvailabilityStatus.AVAILABLE
}

// ---------------------------------------------------------------------------
// Catálogo base com 50 medicamentos reais
// ---------------------------------------------------------------------------
interface MedicationTemplate {
  name: string
  category: MedicationCategories
  description: string
  requiresPrescription: boolean
}

const MEDICATIONS: MedicationTemplate[] = [
  // ── ANALGÉSICOS ──────────────────────────────────────────────────────────
  {
    name: 'Paracetamol 500mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Analgésico e antipirético. Indicado para dor leve a moderada e febre. Apresentação oral de 500 mg por comprimido.',
    requiresPrescription: false
  },
  {
    name: 'Dipirona Sódica 500mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Analgésico e antipirético de uso oral. Indicado para dor e febre. Cada comprimido contém 500 mg de dipirona sódica.',
    requiresPrescription: false
  },
  {
    name: 'Dipirona Sódica 500mg/mL solução injetável',
    category: MedicationCategories.ANALGESICS,
    description:
      'Analgésico e antipirético para uso intravenoso ou intramuscular. Cada mL contém 500 mg de dipirona sódica.',
    requiresPrescription: true
  },
  {
    name: 'Ibuprofeno 600mg comprimido revestido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Anti-inflamatório não esteroidal (AINE) com ação analgésica e antipirética. Indicado para dor e inflamação de intensidade leve a moderada.',
    requiresPrescription: false
  },
  {
    name: 'Tramadol 50mg cápsula',
    category: MedicationCategories.ANALGESICS,
    description:
      'Opioide de ação central indicado para dor moderada a intensa. Cada cápsula contém cloridrato de tramadol 50 mg.',
    requiresPrescription: true
  },
  {
    name: 'Morfina 10mg/mL solução injetável',
    category: MedicationCategories.ANALGESICS,
    description:
      'Opioide potente utilizado no controle de dor intensa, especialmente em contexto pós-cirúrgico ou oncológico. Uso hospitalar.',
    requiresPrescription: true
  },
  {
    name: 'Codeína 30mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Opioide de potência intermediária indicado para dor moderada e tosse seca persistente. Uso com receituário especial.',
    requiresPrescription: true
  },
  {
    name: 'Cetoprofeno 100mg cápsula',
    category: MedicationCategories.ANALGESICS,
    description:
      'Anti-inflamatório não esteroidal indicado para artrite reumatoide, osteoartrite, dismenorreia e dor pós-operatória.',
    requiresPrescription: false
  },
  {
    name: 'Diclofenaco Sódico 50mg comprimido revestido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Anti-inflamatório não esteroidal para tratamento de dor e inflamação em condições musculoesqueléticas e articulares.',
    requiresPrescription: false
  },
  {
    name: 'Ácido Acetilsalicílico 500mg comprimido',
    category: MedicationCategories.ANALGESICS,
    description:
      'Analgésico, antipirético e anti-inflamatório. Em doses menores, utilizado como antiagregante plaquetário na prevenção cardiovascular.',
    requiresPrescription: false
  },

  // ── ANTIBIÓTICOS ─────────────────────────────────────────────────────────
  {
    name: 'Amoxicilina 500mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico betalactâmico de amplo espectro indicado para infecções bacterianas do trato respiratório, urinário e de pele.',
    requiresPrescription: true
  },
  {
    name: 'Amoxicilina + Clavulanato 875mg + 125mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Associação de antibiótico betalactâmico com inibidor de betalactamase para infecções por bactérias resistentes à amoxicilina isolada.',
    requiresPrescription: true
  },
  {
    name: 'Azitromicina 500mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico macrolídeo de dose única diária indicado para infecções respiratórias, sinusite, faringite e pneumonia comunitária.',
    requiresPrescription: true
  },
  {
    name: 'Ciprofloxacino 500mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico fluoroquinolona de amplo espectro indicado para infecções urinárias complicadas, gastrointestinais e respiratórias.',
    requiresPrescription: true
  },
  {
    name: 'Metronidazol 400mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico e antiprotozoário indicado para infecções anaeróbias, tricomoníase, giardíase, amebíase e vaginose bacteriana.',
    requiresPrescription: true
  },
  {
    name: 'Cefalexina 500mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico cefalosporina de 1ª geração indicado para infecções de pele, tecidos moles, trato urinário e respiratório superior.',
    requiresPrescription: true
  },
  {
    name: 'Clindamicina 300mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico lincosamida indicado para infecções graves por anaeróbios e cocos gram-positivos, incluindo infecções osteoarticulares.',
    requiresPrescription: true
  },
  {
    name: 'Doxiciclina 100mg cápsula',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico tetraciclina indicado para leptospirose, riquetsioses, clamídia, sífilis em pacientes alérgicos à penicilina e acne grave.',
    requiresPrescription: true
  },
  {
    name: 'Sulfametoxazol + Trimetoprima 400mg + 80mg comprimido',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Combinação sulfonamida-diaminopirimidina indicada para infecções do trato urinário, pneumocistose e toxoplasmose profilática.',
    requiresPrescription: true
  },
  {
    name: 'Gentamicina 80mg/2mL solução injetável',
    category: MedicationCategories.ANTIBIOTICS,
    description:
      'Antibiótico aminoglicosídeo de uso parenteral para infecções graves por gram-negativos. Requer monitoramento de função renal.',
    requiresPrescription: true
  },

  // ── ANTIVIRAIS ───────────────────────────────────────────────────────────
  {
    name: 'Aciclovir 400mg comprimido',
    category: MedicationCategories.ANTIVIRALS,
    description:
      'Antiviral indicado para herpes simples labial e genital, herpes zóster e varicela. Inibe a replicação do DNA viral.',
    requiresPrescription: true
  },
  {
    name: 'Aciclovir 250mg pó para solução injetável',
    category: MedicationCategories.ANTIVIRALS,
    description:
      'Antiviral para uso intravenoso em casos graves de herpes simples, encefalite herpética e varicela em imunossuprimidos.',
    requiresPrescription: true
  },
  {
    name: 'Oseltamivir 75mg cápsula',
    category: MedicationCategories.ANTIVIRALS,
    description:
      'Inibidor de neuraminidase indicado para tratamento e profilaxia da influenza A e B. Deve ser iniciado nas primeiras 48 h de sintomas.',
    requiresPrescription: true
  },
  {
    name: 'Tenofovir Disoproxila 300mg comprimido',
    category: MedicationCategories.ANTIVIRALS,
    description:
      'Antiviral análogo de nucleotídeo utilizado no tratamento da infecção pelo HIV e hepatite B crônica, em associação a outros antirretrovirais.',
    requiresPrescription: true
  },
  {
    name: 'Lamivudina 150mg comprimido',
    category: MedicationCategories.ANTIVIRALS,
    description:
      'Análogo de nucleosídeo indicado para tratamento da infecção pelo HIV (em esquemas combinados) e hepatite B crônica.',
    requiresPrescription: true
  },

  // ── ANTIFÚNGICOS ─────────────────────────────────────────────────────────
  {
    name: 'Fluconazol 150mg cápsula',
    category: MedicationCategories.ANTIFUNGALS,
    description:
      'Antifúngico triazólico de dose única indicado para candidíase vulvovaginal. Também utilizado em candidíase orofaríngea e prevenção em imunossuprimidos.',
    requiresPrescription: true
  },
  {
    name: 'Fluconazol 2mg/mL solução para infusão',
    category: MedicationCategories.ANTIFUNGALS,
    description:
      'Antifúngico triazólico intravenoso para candidemia, meningite criptocócica e outras infecções fúngicas invasivas.',
    requiresPrescription: true
  },
  {
    name: 'Nistatina 100.000 UI/mL suspensão oral',
    category: MedicationCategories.ANTIFUNGALS,
    description:
      'Antifúngico polieno de uso tópico oral, indicado para candidíase orofaríngea. Não é absorvido pelo trato gastrointestinal.',
    requiresPrescription: false
  },
  {
    name: 'Cetoconazol 200mg comprimido',
    category: MedicationCategories.ANTIFUNGALS,
    description:
      'Antifúngico imidazólico oral para dermatofitoses resistentes, candidíase mucocutânea crônica e paracoccidioidomicose.',
    requiresPrescription: true
  },
  {
    name: 'Anfotericina B 50mg pó para solução injetável',
    category: MedicationCategories.ANTIFUNGALS,
    description:
      'Antifúngico polieno de amplo espectro para infecções fúngicas sistêmicas graves (aspergilose, candidemia, criptococose). Uso hospitalar estrito.',
    requiresPrescription: true
  },

  // ── ANTICONVULSIVANTES ───────────────────────────────────────────────────
  {
    name: 'Fenitoína 100mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description:
      'Antiepiléptico de primeira linha para crises tônico-clônicas generalizadas e parciais. Requer monitoramento de nível sérico.',
    requiresPrescription: true
  },
  {
    name: 'Carbamazepina 200mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description:
      'Antiepiléptico indicado para epilepsia parcial e generalizada, neuralgia do trigêmeo e transtorno bipolar. Requer ajuste de dose gradual.',
    requiresPrescription: true
  },
  {
    name: 'Valproato de Sódio 500mg comprimido revestido',
    category: MedicationCategories.ANTICONVULSANTS,
    description:
      'Antiepiléptico de amplo espectro para ausências, crises mioclônicas e tônico-clônicas. Também utilizado na profilaxia de enxaqueca.',
    requiresPrescription: true
  },
  {
    name: 'Fenobarbital 100mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description:
      'Barbitúrico anticonvulsivante de longa duração indicado para epilepsia tônico-clônica e parcial. Uso com receituário especial.',
    requiresPrescription: true
  },
  {
    name: 'Lamotrigina 100mg comprimido',
    category: MedicationCategories.ANTICONVULSANTS,
    description:
      'Antiepiléptico indicado como monoterapia ou terapia adjuvante em epilepsia parcial, Lennox-Gastaut e transtorno bipolar.',
    requiresPrescription: true
  },

  // ── ANTIDEPRESSIVOS ──────────────────────────────────────────────────────
  {
    name: 'Fluoxetina 20mg cápsula',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description:
      'Inibidor seletivo da recaptação de serotonina (ISRS) indicado para depressão maior, TOC, bulimia nervosa e transtorno do pânico.',
    requiresPrescription: true
  },
  {
    name: 'Sertralina 50mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description:
      'ISRS indicado para depressão maior, transtorno do pânico, fobia social, TEPT e TOC. Boa tolerabilidade em adultos e idosos.',
    requiresPrescription: true
  },
  {
    name: 'Escitalopram 10mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description:
      'ISRS de alta seletividade indicado para depressão maior e transtorno de ansiedade generalizada. Perfil de efeitos adversos favorável.',
    requiresPrescription: true
  },
  {
    name: 'Amitriptilina 25mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description:
      'Antidepressivo tricíclico indicado para depressão, dor crônica neuropática, enxaqueca profilática e fibromialgia.',
    requiresPrescription: true
  },
  {
    name: 'Imipramina 25mg comprimido',
    category: MedicationCategories.ANTIDEPRESSANTS,
    description:
      'Antidepressivo tricíclico indicado para depressão maior e enurese noturna em crianças. Requer monitoramento cardíaco.',
    requiresPrescription: true
  },

  // ── ANTIPSICÓTICOS ───────────────────────────────────────────────────────
  {
    name: 'Haloperidol 5mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico típico (butirofenona) indicado para esquizofrenia, mania aguda, agitação psicomotora e síndrome de Tourette.',
    requiresPrescription: true
  },
  {
    name: 'Haloperidol 5mg/mL solução injetável',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Formulação parenteral de haloperidol para controle rápido de agitação psicomotora intensa em ambiente hospitalar.',
    requiresPrescription: true
  },
  {
    name: 'Risperidona 2mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico atípico indicado para esquizofrenia, transtorno bipolar e irritabilidade associada ao transtorno do espectro autista.',
    requiresPrescription: true
  },
  {
    name: 'Quetiapina 200mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico atípico indicado para esquizofrenia, episódios maníacos e depressivos do transtorno bipolar.',
    requiresPrescription: true
  },
  {
    name: 'Olanzapina 10mg comprimido',
    category: MedicationCategories.ANTIPSICOTICOS,
    description:
      'Antipsicótico atípico indicado para esquizofrenia e transtorno bipolar. Monitoramento de glicemia e perfil lipídico é recomendado.',
    requiresPrescription: true
  },

  // ── ANTISSÉPTICOS ────────────────────────────────────────────────────────
  {
    name: 'Clorexidina 0,12% solução para bochecho',
    category: MedicationCategories.ANTISEPTICS,
    description:
      'Antisséptico bucal indicado para controle da placa bacteriana, gengivite e profilaxia pós-cirúrgica odontológica.',
    requiresPrescription: false
  },
  {
    name: 'Povidona Iodada 10% solução tópica',
    category: MedicationCategories.ANTISEPTICS,
    description:
      'Antisséptico tópico de amplo espectro para limpeza e desinfecção de feridas, queimaduras e preparo de campo cirúrgico.',
    requiresPrescription: false
  },
  {
    name: 'Álcool Etílico 70% solução',
    category: MedicationCategories.ANTISEPTICS,
    description:
      'Antisséptico e desinfetante para higiene das mãos, preparo de pele e descontaminação de superfícies e equipamentos.',
    requiresPrescription: false
  },

  // ── ANTIVENENOS ──────────────────────────────────────────────────────────
  {
    name: 'Soro Antibotrópico liofilizado (10 ampolas)',
    category: MedicationCategories.ANTIVENOMS,
    description:
      'Imunoglobulinas equinas purificadas para neutralização do veneno de serpentes do gênero Bothrops (jararaca). Uso hospitalar exclusivo.',
    requiresPrescription: true
  },
  {
    name: 'Soro Antiaracnídico liofilizado (5 ampolas)',
    category: MedicationCategories.ANTIVENOMS,
    description:
      'Imunoglobulinas equinas purificadas para neutralização de venenos de escorpiões e aranhas (Loxosceles e Phoneutria). Uso hospitalar.',
    requiresPrescription: true
  },

  // ── OUTROS ───────────────────────────────────────────────────────────────
  {
    name: 'Omeprazol 20mg cápsula',
    category: MedicationCategories.OTHER,
    description:
      'Inibidor de bomba de prótons indicado para úlcera péptica, DRGE, erradicação do H. pylori e prevenção de úlcera por AINEs.',
    requiresPrescription: false
  },
  {
    name: 'Metformina 850mg comprimido',
    category: MedicationCategories.OTHER,
    description:
      'Biguanida antidiabética indicada como primeira escolha no tratamento do diabetes mellitus tipo 2. Reduz a produção hepática de glicose.',
    requiresPrescription: true
  },
  {
    name: 'Enalapril 10mg comprimido',
    category: MedicationCategories.OTHER,
    description:
      'Inibidor da ECA indicado para hipertensão arterial, insuficiência cardíaca e proteção renal no diabetes. Contraindicado na gestação.',
    requiresPrescription: true
  },
  {
    name: 'Losartana Potássica 50mg comprimido',
    category: MedicationCategories.OTHER,
    description:
      'Antagonista dos receptores de angiotensina II indicado para hipertensão arterial, nefropatia diabética e insuficiência cardíaca.',
    requiresPrescription: true
  },
  {
    name: 'Sinvastatina 40mg comprimido',
    category: MedicationCategories.OTHER,
    description:
      'Inibidor da HMG-CoA redutase (estatina) indicado para dislipidemia e prevenção de eventos cardiovasculares.',
    requiresPrescription: true
  },
  {
    name: 'Salbutamol 100mcg/dose aerossol',
    category: MedicationCategories.OTHER,
    description:
      'Broncodilatador beta-2 agonista de curta duração para alívio rápido do broncoespasmo em asma e DPOC.',
    requiresPrescription: true
  },
  {
    name: 'Dexametasona 4mg/mL solução injetável',
    category: MedicationCategories.OTHER,
    description:
      'Corticosteroide de potente ação anti-inflamatória e imunossupressora para choque anafilático, edema cerebral e crises asmáticas graves.',
    requiresPrescription: true
  },
  {
    name: 'Hidroclorotiazida 25mg comprimido',
    category: MedicationCategories.OTHER,
    description:
      'Diurético tiazídico indicado para hipertensão arterial e edema associado a insuficiência cardíaca ou hepática.',
    requiresPrescription: true
  }
]

// ---------------------------------------------------------------------------
// Script
// ---------------------------------------------------------------------------
const seedMedications: Script = {
  name: 'create-medications',
  description:
    'Insere 50 medicamentos reais em cada unidade de saúde cadastrada no sistema',
  async run() {
    console.log('Deletando os medicamentos já existentes')
    const removed = await MedicationModel.deleteMany({})
    console.log(`Foram deletados ${removed.deletedCount} medicamentos`)

    console.log(
      `Iniciando seed de ${MEDICATIONS.length} medicamentos em ${UNIT_IDS.length} unidades...\n`
    )

    let totalInserted = 0
    let totalErrors = 0

    for (const unitId of UNIT_IDS) {
      const profile = UNIT_PROFILE[unitId]
      const { min, max } = STOCK_RANGE[profile]
      console.log(`\nUnidade ${unitId} [${profile}]`)

      for (const template of MEDICATIONS) {
        try {
          // Estoque aleatório dentro da faixa do perfil da unidade.
          // Antivenenos e morfina têm volumes menores por política de controle.
          const isControlled =
            template.category === MedicationCategories.ANTIVENOMS ||
            template.name.toLowerCase().includes('morfina')

          const stockMin = isControlled
            ? Math.max(1, Math.floor(min / 10))
            : min
          const stockMax = isControlled
            ? Math.max(5, Math.floor(max / 10))
            : max
          const stockQuantity = randomInt(stockMin, stockMax)

          const availabilityStatus = resolveStatus(stockQuantity, profile)

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
    }

    console.log('\n─────────────────────────────────────────')
    console.log(`✅ Inseridos : ${totalInserted}`)
    console.log(`❌ Erros     : ${totalErrors}`)
    console.log('─────────────────────────────────────────')
    process.exit(0)
  }
}

export default seedMedications
