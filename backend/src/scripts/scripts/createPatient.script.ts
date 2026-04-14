import { faker } from '@faker-js/faker'
import { BloodType } from '../../interfaces/IPatient.js'
import { Patient } from '../../models/PatientModel.js'
import { Script } from '../types.js'

const UNITS_PATIENTS: { unitId: string; patients: number }[] = [
  { unitId: '69d2981909395bf057e0513f', patients: 171 },
  { unitId: '69d2981909395bf057e05137', patients: 194 },
  { unitId: '69d2981909395bf057e05127', patients: 19 },
  { unitId: '69d2981909395bf057e05115', patients: 64 },
  { unitId: '69d2981909395bf057e05105', patients: 79 },
  { unitId: '69d2981909395bf057e050f6', patients: 108 },
  { unitId: '69d2981909395bf057e0511e', patients: 185 },
  { unitId: '69d2981909395bf057e050e6', patients: 140 },
  { unitId: '69d2981909395bf057e0510c', patients: 147 },
  { unitId: '69d2981909395bf057e050ee', patients: 97 },
  { unitId: '69d2981909395bf057e05130', patients: 168 },
  { unitId: '69d2981909395bf057e050fd', patients: 180 }
]

const createPatientsByUnit: Script = {
  name: 'create-patients-by-unit',
  description: 'Cria pacientes distribuídos por unidade',
  async run() {
    function generateCPF() {
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

    function generatePhone() {
      return Number('119' + faker.number.int({ min: 10000000, max: 99999999 }))
    }

    function generateHealthPlanNumber() {
      return faker.number
        .int({ min: 100000000000, max: 999999999999 })
        .toString()
    }

    async function createPatient(unitId: string) {
      const gender = faker.helpers.arrayElement(['male', 'female'])
      const name = faker.person.fullName({ sex: gender })

      const invalidNameParts = [
        'mr',
        'mrs',
        'miss',
        'dr',
        'jr',
        'sr',
        'ii',
        'iii'
      ]
      const nameParts = name
        .trim()
        .split(/\s+/)
        .map((part) => part.toLowerCase().replace(/\./g, ''))
        .filter((part) => part && !invalidNameParts.includes(part))
      const firstName = nameParts[0]
      const lastName = nameParts[nameParts.length - 1]
      const email = `patient.${firstName}.${lastName}.${faker.number.int({ min: 100, max: 999 })}@yopmail.com`

      const bloodTypes = Object.values(BloodType)

      const patient = {
        name,
        cpf: generateCPF(),
        email,
        password: 'fastpass',
        gender,
        cellphone: generatePhone(),
        birthDate: faker.date.birthdate({ min: 1, max: 95, mode: 'age' }),
        bloodType: faker.helpers.arrayElement(bloodTypes),
        allergies:
          faker.helpers.maybe(
            () =>
              faker.helpers.arrayElements(
                [
                  'Penicilina',
                  'AAS',
                  'Dipirona',
                  'Látex',
                  'Frutos do mar',
                  'Amendoim'
                ],
                { min: 1, max: 3 }
              ),
            { probability: 0.3 }
          ) ?? [],
        unitId
      }

      try {
        const response = await Patient.create(patient as any)
        console.log(
          `✅ [Unidade ${unitId.slice(-6)}] Paciente criado: ${response.name}`
        )
      } catch (error: any) {
        console.error(
          `❌ [Unidade ${unitId.slice(-6)}] Erro:`,
          error.response?.data || error.message
        )
      }
    }

    let totalCreated = 0

    for (const { unitId, patients } of UNITS_PATIENTS) {
      console.log(
        `\n📋 Criando ${patients} paciente(s) para unidade ...${unitId.slice(-6)}`
      )
      for (let i = 0; i < patients; i++) {
        await createPatient(unitId)
        totalCreated++
      }
    }

    console.log(
      `\n🚀 Seed finalizado — ${totalCreated} pacientes criados no total`
    )
  }
}

export default createPatientsByUnit
