import { faker } from '@faker-js/faker'
import { BloodType } from '../../interfaces/IPatient.js'
import { Patient } from '../../models/PatientModel.js'
import { Script } from '../types.js'

const createPatients: Script = {
  name: 'create-patient',
  description: 'Cria 30 paciente para testes',
  async run() {
    function generateCPF() {
      let cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

      const calcDigit = (base: number[]) => {
        let sum = base.reduce(
          (acc, num, i) => acc + num * (base.length + 1 - i),
          0
        )
        let rest = (sum * 10) % 11
        return rest === 10 ? 0 : rest
      }
      cpf.push(calcDigit(cpf))
      cpf.push(calcDigit(cpf))
      return cpf.join('')
    }

    function generatePhone() {
      return Number('119' + faker.number.int({ min: 10000000, max: 99999999 }))
    }

    function generateBloodType() {
      return faker.helpers.arrayElement(Object.values(BloodType))
    }

    async function createPatient() {
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
      const firstName = nameParts[0].toLowerCase()
      const lastName = nameParts[nameParts.length - 1].toLowerCase()
      const email = `patient.${firstName}.${lastName}@yopmail.com`
      const patient = {
        name,
        cpf: generateCPF(),
        email,
        password: 'fastpass',
        gender,
        cellphone: generatePhone(),
        birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        bloodType: generateBloodType(),
        conditions: [],
        allergies: []
      }
      try {
        const response = await Patient.create(patient)
        console.log('✅ Criado:', response)
      } catch (error: any) {
        console.error('❌ Erro:', error.response?.data || error.message)
      }
    }
    for (let i = 0; i < 30; i++) {
      await createPatient()
    }
    console.log('🚀 Seed de patients finalizado')
  }
}

export default createPatients
