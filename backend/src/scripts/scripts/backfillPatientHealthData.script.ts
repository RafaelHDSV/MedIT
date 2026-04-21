import { faker } from '@faker-js/faker'
import { Patient } from '../../models/PatientModel.js'
import { Script } from '../types.js'

const ALLERGY_POOL = [
  'Penicilina',
  'AAS',
  'Dipirona',
  'Látex',
  'Frutos do mar',
  'Amendoim',
  'Pólen',
  'Pelos de animais',
  'Picadas de insetos',
  'Lactose',
  'Glúten',
  'Poeira'
]

const CONDITION_POOL = [
  'Diabetes',
  'Hipertensão',
  'Asma',
  'Obesidade',
  'Ansiedade',
  'Depressão',
  'Doença cardíaca',
  'Rinite',
  'Sinusite',
  'Doença renal'
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function isMissingPositiveNumber(value: unknown): boolean {
  return (
    value == null ||
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value <= 0
  )
}

function ageFromBirthDate(birthDate?: Date | null): number | null {
  if (
    !birthDate ||
    !(birthDate instanceof Date) ||
    Number.isNaN(birthDate.getTime())
  ) {
    return null
  }
  const diff = Date.now() - birthDate.getTime()
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000))
  return years >= 0 && years <= 120 ? years : null
}

function generateHeightWeightPair(seed: number, birthDate?: Date | null) {
  faker.seed(seed)
  const age =
    ageFromBirthDate(birthDate) ?? faker.number.int({ min: 18, max: 85 })

  if (age < 2) {
    const height = faker.number.float({
      min: 0.62,
      max: 0.98,
      fractionDigits: 2
    })
    const weight = faker.number.float({ min: 6, max: 16, fractionDigits: 1 })
    return { height, weight }
  }

  if (age < 10) {
    const height = faker.number.float({
      min: 0.95,
      max: 1.45,
      fractionDigits: 2
    })
    const weight = faker.number.float({ min: 14, max: 42, fractionDigits: 1 })
    return { height, weight }
  }

  if (age < 18) {
    const height = faker.number.float({
      min: 1.35,
      max: 1.88,
      fractionDigits: 2
    })
    const bmi = faker.number.float({ min: 16, max: 30, fractionDigits: 1 })
    const weight = Math.round(bmi * height * height * 10) / 10
    return { height, weight: Math.min(95, Math.max(32, weight)) }
  }

  const height = faker.number.float({ min: 1.48, max: 1.98, fractionDigits: 2 })
  const bmi = faker.number.float({ min: 18.5, max: 34, fractionDigits: 1 })
  let weight = Math.round(bmi * height * height * 10) / 10
  weight = Math.min(160, Math.max(38, weight))
  return { height, weight }
}

function fillAnthropometry(
  seed: number,
  birthDate: Date | null | undefined,
  existingHeight: unknown,
  existingWeight: unknown
): { height?: number; weight?: number } {
  const needH = isMissingPositiveNumber(existingHeight)
  const needW = isMissingPositiveNumber(existingWeight)
  if (!needH && !needW) return {}

  if (needH && needW) {
    return generateHeightWeightPair(seed, birthDate)
  }

  faker.seed(seed + 7)

  if (
    !needH &&
    needW &&
    typeof existingHeight === 'number' &&
    existingHeight > 0
  ) {
    const bmi = faker.number.float({ min: 18.5, max: 34, fractionDigits: 1 })
    let w = Math.round(bmi * existingHeight * existingHeight * 10) / 10
    w = Math.min(160, Math.max(12, w))
    return { weight: w }
  }

  if (
    needH &&
    !needW &&
    typeof existingWeight === 'number' &&
    existingWeight > 0
  ) {
    const bmi = faker.number.float({ min: 19, max: 32, fractionDigits: 1 })
    let h = Math.sqrt(existingWeight / bmi)
    h = Math.min(2.1, Math.max(0.55, h))
    return { height: Math.round(h * 100) / 100 }
  }

  return generateHeightWeightPair(seed, birthDate)
}

function arraysBothEmpty(
  conditions?: string[] | null,
  allergies?: string[] | null
) {
  const c = conditions?.filter(Boolean) ?? []
  const a = allergies?.filter(Boolean) ?? []
  return c.length === 0 && a.length === 0
}

const backfillPatientHealthData: Script = {
  name: 'backfill-patient-health-data',
  description:
    'Preenche altura e peso ausentes (obrigatório para o app) e, quando não há nenhuma alergia nem condição, adiciona listas opcionais com probabilidade (dados de demonstração)',
  async run() {
    const patients = await Patient.find({})

    let filledAnthropometry = 0
    let filledOptionalLists = 0
    let skipped = 0

    for (const p of patients) {
      const idStr = String(p._id)
      const baseSeed = hashString(idStr)

      const needHeight = isMissingPositiveNumber(p.height)
      const needWeight = isMissingPositiveNumber(p.weight)

      const $set: Record<string, unknown> = {}

      if (needHeight || needWeight) {
        const gen = fillAnthropometry(
          baseSeed,
          p.birthDate ?? undefined,
          p.height,
          p.weight
        )
        if (gen.height !== undefined) $set.height = gen.height
        if (gen.weight !== undefined) $set.weight = gen.weight
        filledAnthropometry++
      }

      if (arraysBothEmpty(p.conditions, p.allergies)) {
        faker.seed(baseSeed + 17)
        const allergies =
          faker.helpers.maybe(
            () =>
              faker.helpers.arrayElements(ALLERGY_POOL, {
                min: 1,
                max: Math.min(3, ALLERGY_POOL.length)
              }),
            { probability: 0.38 }
          ) ?? []

        faker.seed(baseSeed + 31)
        const conditions =
          faker.helpers.maybe(
            () =>
              faker.helpers.arrayElements(CONDITION_POOL, {
                min: 1,
                max: Math.min(3, CONDITION_POOL.length)
              }),
            { probability: 0.28 }
          ) ?? []

        if (allergies.length) $set.allergies = allergies
        if (conditions.length) $set.conditions = conditions
        if (allergies.length || conditions.length) filledOptionalLists++
      }

      if (Object.keys($set).length === 0) {
        skipped++
        continue
      }

      await Patient.updateOne({ _id: p._id }, { $set })
      const parts = Object.keys($set).join(', ')
      console.log(`✅ ${p.name} — ${parts}`)
    }

    console.log(
      `\nResumo: ${filledAnthropometry} paciente(s) com altura/peso ajustados, ` +
        `${filledOptionalLists} com alergias e/ou condições preenchidas (onde ambos estavam vazios), ` +
        `${skipped} sem alteração.`
    )
  }
}

export default backfillPatientHealthData
