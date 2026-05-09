import { faker } from '@faker-js/faker'
import { DoctorSpecializations } from '../../interfaces/IDoctor.js'
import { UserGender, UserLevels } from '../../interfaces/IUser.js'
import { Doctor } from '../../models/DoctorModel.js'
import { Script } from '../types.js'

const UNITS_DOCTORS: { unitId: string; count: number }[] = [
  { unitId: '69d2981909395bf057e0513f', count: 24 },
  { unitId: '69d2981909395bf057e05137', count: 26 },
  { unitId: '69d2981909395bf057e05127', count: 20 },
  { unitId: '69d2981909395bf057e05115', count: 28 },
  { unitId: '69d2981909395bf057e05105', count: 28 },
  { unitId: '69d2981909395bf057e050f6', count: 26 },
  { unitId: '69d2981909395bf057e0511e', count: 28 },
  { unitId: '69d2981909395bf057e050e6', count: 30 },
  { unitId: '69d2981909395bf057e0510c', count: 30 },
  { unitId: '69d2981909395bf057e050ee', count: 26 },
  { unitId: '69d2981909395bf057e05130', count: 29 },
  { unitId: '69d2981909395bf057e050fd', count: 23 }
]

const createDoctorsByUnit: Script = {
  name: 'create-doctors-by-unit',
  description: 'Cria médicos distribuídos por unidade',
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

    function generateCRM(): string {
      return faker.number.int({ min: 100000, max: 999999 }).toString() + '/SP'
    }

    function generateSpecialization(): string {
      const specializations = Object.values(DoctorSpecializations)
      const picked = faker.helpers.arrayElement(specializations)

      if (picked === DoctorSpecializations.OTHER) {
        return faker.helpers.arrayElement([
          'acupuntura',
          'medicina esportiva',
          'medicina do trabalho'
        ])
      }

      return picked.toLowerCase()
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
      return `doctor.${first}.${last}.${index}@yopmail.com`
    }

    let totalCreated = 0
    let emailIndex = 1

    for (const { unitId, count } of UNITS_DOCTORS) {
      console.log(
        `\n📋 Criando ${count} médico(s) para unidade ...${unitId.slice(-6)}`
      )

      for (let i = 0; i < count; i++) {
        const gender = faker.helpers.arrayElement(Object.values(UserGender))
        const name = faker.person.fullName({
          sex: gender === UserGender.MALE ? 'male' : 'female'
        })

        const doctor = {
          name,
          cpf: generateCPF(),
          level: UserLevels.DOCTOR,
          email: buildEmail(name, emailIndex++),
          password: 'fastpass',
          gender,
          cellphone: generateCellphone(),
          birthDate: faker.date.birthdate({ min: 25, max: 70, mode: 'age' }),
          unitId,
          crm: generateCRM(),
          specialization: generateSpecialization(),
          workLocationLabel: `Consultorio ${faker.number.int({ min: 1, max: 30 })}`
        }

        try {
          const response = await Doctor.create(doctor as any)
          console.log(`  ✅ ${response.name} — ${doctor.crm}`)
          totalCreated++
        } catch (error: any) {
          console.error(`  ❌ Erro:`, error.response?.data || error.message)
        }
      }
    }

    console.log(`\n🚀 Seed finalizado — ${totalCreated} médico(s) criado(s)`)
  }
}

export default createDoctorsByUnit
