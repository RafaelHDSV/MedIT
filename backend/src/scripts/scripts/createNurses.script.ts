import { faker } from '@faker-js/faker'
import { NurseShifts } from '../../interfaces/INurse.js'
import { UserGender, UserLevels } from '../../interfaces/IUser.js'
import { Nurse } from '../../models/NurseModel.js'
import { Script } from '../types.js'

const UNITS_NURSES: { unitId: string; count: number }[] = [
  { unitId: '69d2981909395bf057e0513f', count: 36 },
  { unitId: '69d2981909395bf057e05137', count: 33 },
  { unitId: '69d2981909395bf057e05127', count: 36 },
  { unitId: '69d2981909395bf057e05115', count: 27 },
  { unitId: '69d2981909395bf057e05105', count: 31 },
  { unitId: '69d2981909395bf057e050f6', count: 32 },
  { unitId: '69d2981909395bf057e0511e', count: 31 },
  { unitId: '69d2981909395bf057e050e6', count: 31 },
  { unitId: '69d2981909395bf057e0510c', count: 21 },
  { unitId: '69d2981909395bf057e050ee', count: 22 },
  { unitId: '69d2981909395bf057e05130', count: 25 },
  { unitId: '69d2981909395bf057e050fd', count: 33 }
]

const createNursesByUnit: Script = {
  name: 'create-nurses-by-unit',
  description: 'Cria enfermeiros distribuídos por unidade',
  async run() {
    function generateCPF(): string {
      const cpf = Array.from({ length: 9 }, () =>
        Math.floor(Math.random() * 10)
      )

      const calcDigit = (base: number[]) => {
        const sum = base.reduce(
          (acc, num, i) => acc + num * (base.length + 1 - i),
          0
        )
        const rest = (sum * 10) % 11
        return rest === 10 ? 0 : rest
      }

      cpf.push(calcDigit(cpf))
      cpf.push(calcDigit(cpf))
      return cpf.join('')
    }

    function generateCellphone(): number {
      return Number('119' + faker.number.int({ min: 10000000, max: 99999999 }))
    }

    function generateCOREN(): string {
      const number = faker.number.int({ min: 100000, max: 999999 })
      const category = faker.helpers.arrayElement(['ENF', 'TE', 'AE'])
      return `${number}/SP-${category}`
    }

    function buildEmail(name: string, index: number): string {
      const invalidParts = ['mr', 'mrs', 'miss', 'dr', 'jr', 'sr', 'ii', 'iii']
      const parts = name
        .trim()
        .split(/\s+/)
        .map((p) => p.toLowerCase().replace(/\./g, ''))
        .filter((p) => p && !invalidParts.includes(p))

      const first = parts[0]
      const last = parts[parts.length - 1]
      return `nurse.${first}.${last}.${index}@yopmail.com`
    }

    let totalCreated = 0
    let emailIndex = 1

    for (const { unitId, count } of UNITS_NURSES) {
      console.log(
        `\n📋 Criando ${count} enfermeiro(s) para unidade ...${unitId.slice(-6)}`
      )

      for (let i = 0; i < count; i++) {
        const gender = faker.helpers.arrayElement(Object.values(UserGender))
        const name = faker.person.fullName({
          sex: gender === UserGender.MALE ? 'male' : 'female'
        })

        const nurse = {
          name,
          cpf: generateCPF(),
          level: UserLevels.NURSE,
          email: buildEmail(name, emailIndex++),
          password: 'fastpass',
          gender,
          cellphone: generateCellphone(),
          birthDate: faker.date.birthdate({ min: 20, max: 65, mode: 'age' }),
          unitId,
          coren: generateCOREN(),
          shift: faker.helpers.arrayElement(Object.values(NurseShifts)),
          workLocationLabel: `Sala triagem ${faker.number.int({ min: 1, max: 10 })}`
        }

        try {
          const response = await Nurse.create(nurse as any)
          console.log(`  ✅ ${response.name} — ${nurse.coren} (${nurse.shift})`)
          totalCreated++
        } catch (error: any) {
          console.error(`  ❌ Erro:`, error.response?.data || error.message)
        }
      }
    }

    console.log(
      `\n🚀 Seed finalizado — ${totalCreated} enfermeiro(s) criado(s)`
    )
  }
}

export default createNursesByUnit
