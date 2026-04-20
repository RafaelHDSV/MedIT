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

interface MedicationTemplate {
  name: string
  category: MedicationCategories
  description: string
  requiresPrescription: boolean
}

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

/** Fração do catálogo permitido (por perfil); cada unidade sorteia dentro da faixa. */
const PROFILE_CATALOG_RATIO: Record<UnitProfile, { min: number; max: number }> =
  {
    ubs: { min: 0.4, max: 0.7 },
    upa: { min: 0.62, max: 0.85 },
    hospital: { min: 0.82, max: 1 },
    especialidades: { min: 0.45, max: 0.72 }
  }

/** Piso de itens no catálogo após o recorte (evita unidade vazia demais). */
const MIN_MEDS_PER_UNIT = 22

const FORCED_UNAVAILABLE_COUNT = 5

/** Medicamentos exclusivos do perfil (não entram no catálogo comum). */
const PROFILE_EXTRA_MEDICATIONS: Partial<
  Record<UnitProfile, MedicationTemplate[]>
> = {
  ubs: [
    {
      name: 'Vitamina C 500mg efervescente',
      category: MedicationCategories.OTHER,
      description: 'Suplementação vitamínica oral.',
      requiresPrescription: false
    },
    {
      name: 'Soro Fisiológico 0,9% 250mL frasco',
      category: MedicationCategories.OTHER,
      description: 'Reidratação e diluição de medicamentos IV.',
      requiresPrescription: false
    },
    {
      name: 'Benzilpenicilina Potássica 600.000 UI pó injetável',
      category: MedicationCategories.ANTIBIOTICS,
      description: 'Penicilina G para infecções estreptocócicas sensíveis.',
      requiresPrescription: true
    }
  ],
  upa: [
    {
      name: 'Adrenalina 1mg/mL solução injetável (ampola)',
      category: MedicationCategories.OTHER,
      description: 'Urgência: anafilaxia, parada cardiorrespiratória.',
      requiresPrescription: true
    },
    {
      name: 'Noradrenalina 2mg/1mL ampola',
      category: MedicationCategories.OTHER,
      description: 'Vasopressor para choque séptico e hipotensão grave.',
      requiresPrescription: true
    },
    {
      name: 'Midazolam 5mg/mL solução injetável',
      category: MedicationCategories.OTHER,
      description: 'Sedação procedural e crise convulsiva em urgência.',
      requiresPrescription: true
    },
    {
      name: 'Cloreto de Potássio 10% frasco-ampola',
      category: MedicationCategories.OTHER,
      description: 'Reposição eletrolítica com monitorização.',
      requiresPrescription: true
    }
  ],
  hospital: [
    {
      name: 'Meropeném 1g pó para solução injetável',
      category: MedicationCategories.ANTIBIOTICS,
      description: 'Carbapenêm para sepse e infecções hospitalares graves.',
      requiresPrescription: true
    },
    {
      name: 'Vancomicina 500mg pó para solução injetável',
      category: MedicationCategories.ANTIBIOTICS,
      description: 'Glicopeptídeo para MRSA e gram-positivos resistentes.',
      requiresPrescription: true
    },
    {
      name: 'Fentanila 50mcg/mL ampola',
      category: MedicationCategories.ANALGESICS,
      description: 'Opioide IV para dor intensa e sedação em UTI.',
      requiresPrescription: true
    },
    {
      name: 'Rocurônio 10mg/mL solução injetável',
      category: MedicationCategories.OTHER,
      description: 'Bloqueador neuromuscular para intubação e cirurgia.',
      requiresPrescription: true
    },
    {
      name: 'Albumina Humana 20% frasco',
      category: MedicationCategories.OTHER,
      description: 'Volume expansor em hipoproteinemia e ascite.',
      requiresPrescription: true
    }
  ],
  especialidades: [
    {
      name: 'Metotrexato 2,5mg comprimido',
      category: MedicationCategories.OTHER,
      description: 'Imunossupressor em artrite reumatoide e psoríase.',
      requiresPrescription: true
    },
    {
      name: 'Adalimumabe 40mg/0,8mL seringa preenchida',
      category: MedicationCategories.OTHER,
      description: 'Anti-TNF para doenças imunomediadas.',
      requiresPrescription: true
    },
    {
      name: 'Levetiracetam 500mg comprimido',
      category: MedicationCategories.ANTICONVULSANTS,
      description: 'Antiepiléptico de segunda linha.',
      requiresPrescription: true
    }
  ]
}

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
  if (count <= 0 || total <= 0) return new Set()
  const step = Math.max(1, Math.floor(total / count))
  const indexes = new Set<number>()
  for (let i = 0; i < count; i++) {
    indexes.add((i * step + offset) % total)
  }
  return indexes
}

function hashUnitSeed(unitId: string, salt = 0): number {
  let h = (salt >>> 0) ^ 0x811c9dc5
  for (let i = 0; i < unitId.length; i++) {
    h = (Math.imul(31, h) + unitId.charCodeAt(i)) >>> 0
  }
  return h === 0 ? 0x9e3779b9 : h
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleWithSeed<T>(items: T[], unitId: string): T[] {
  const rng = mulberry32(hashUnitSeed(unitId, 1))
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const t = a[i]!
    a[i] = a[j]!
    a[j] = t
  }
  return a
}

/** Catálogo por unidade: recorte aleatório estável + extras do perfil. */
function buildCatalogForUnit(
  unitId: string,
  profile: UnitProfile,
  allowedMeds: MedicationTemplate[]
): MedicationTemplate[] {
  const { min: rMin, max: rMax } = PROFILE_CATALOG_RATIO[profile]
  const h0 = hashUnitSeed(unitId, 0)
  const t = (h0 % 1000) / 1000
  const ratio = rMin + t * (rMax - rMin)
  let take = Math.floor(allowedMeds.length * ratio)
  take = Math.min(allowedMeds.length, Math.max(MIN_MEDS_PER_UNIT, take))

  const shuffled = shuffleWithSeed(allowedMeds, unitId)
  const picked = shuffled.slice(0, take)

  const extras = PROFILE_EXTRA_MEDICATIONS[profile] ?? []
  const names = new Set(picked.map((m) => m.name))
  const merged: MedicationTemplate[] = [...picked]
  for (const e of extras) {
    if (!names.has(e.name)) {
      merged.push(e)
      names.add(e.name)
    }
  }
  return merged
}

/** Teto de estoque efetivo varia por `unitId` (mesmo perfil → volumes diferentes). */
function effectiveStockRange(
  unitId: string,
  profile: UnitProfile
): { min: number; max: number } {
  const { min, max } = STOCK_RANGE[profile]
  const h = hashUnitSeed(unitId, 4)
  const mult = 0.42 + ((h % 770) / 1000) * (1.18 - 0.42)
  const rawMax = Math.floor(max * mult)
  const scaledMax = Math.max(40, Math.min(Math.floor(max * 1.22), rawMax))
  return { min, max: scaledMax }
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
    'Medicamentos por unidade: catálogo recortado + exclusivos do perfil; estoques com teto variável por unidade',
  async run() {
    console.log('Deletando os medicamentos já existentes')
    const removed = await MedicationModel.deleteMany({})
    console.log(`Foram deletados ${removed.deletedCount} medicamentos\n`)

    console.log(
      `Seed: pool global ${MEDICATIONS.length} itens → cada unidade recebe subconjunto + extras do perfil (${UNIT_IDS.length} unidades).\n`
    )

    let totalInserted = 0
    let totalErrors = 0

    for (let u = 0; u < UNIT_IDS.length; u++) {
      const unitId = UNIT_IDS[u]
      const profile = UNIT_PROFILE[unitId]
      const { min: rangeMin, max: rangeMax } = effectiveStockRange(
        unitId,
        profile
      )

      const allowedMeds = MEDICATIONS.filter((m) =>
        isAllowedForProfile(m, profile)
      )

      const unitCatalog = buildCatalogForUnit(unitId, profile, allowedMeds)

      const unavailableSlots = Math.min(
        FORCED_UNAVAILABLE_COUNT,
        Math.max(2, Math.floor(unitCatalog.length * 0.07))
      )
      const forcedUnavailable = unavailableIndexes(
        unitCatalog.length,
        unavailableSlots,
        hashUnitSeed(unitId, 5) % Math.max(1, unitCatalog.length)
      )

      console.log(
        `Unidade ${unitId} [${profile}] — ${unitCatalog.length} itens no catálogo (permitidos no pool: ${allowedMeds.length}), estoque 0..${rangeMax}, zerados: [${[...forcedUnavailable].sort((a, b) => a - b).join(', ')}]`
      )

      for (let i = 0; i < unitCatalog.length; i++) {
        const template = unitCatalog[i]

        try {
          let stockQuantity: number

          if (forcedUnavailable.has(i)) {
            stockQuantity = 0
          } else {
            const isControlled =
              template.category === MedicationCategories.ANTIVENOMS ||
              template.name.toLowerCase().includes('morfina') ||
              template.name.toLowerCase().includes('fentanila')

            const stockMin = isControlled
              ? Math.max(1, Math.floor(rangeMin / 10))
              : rangeMin
            const stockMax = isControlled
              ? Math.max(5, Math.floor(rangeMax / 10))
              : rangeMax

            const base = randomInt(stockMin, stockMax)
            const jitter = 0.85 + Math.random() * 0.28
            stockQuantity = Math.min(
              stockMax,
              Math.max(1, Math.floor(base * jitter))
            )
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
