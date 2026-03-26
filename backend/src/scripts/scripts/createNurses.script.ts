import { faker } from '@faker-js/faker'
import { NurseCorenType, NurseShifts } from '../../interfaces/INurse.js'
import { Nurse } from '../../models/NurseModel.js'
import { Script } from '../types.js'

const createNurses: Script = {
  name: 'create-nurses',
  description: 'Cria 30 enfermeiros para testes',
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

    function generateCoren() {
      const number = faker.number
        .int({ min: 1, max: 999999 })
        .toString()
        .padStart(6, '0')

      const formatted = number.replace(/(\d{3})(\d{3})/, '$1.$2')

      const uf = 'SP'

      const types = Object.values(NurseCorenType)
      const type = faker.helpers.arrayElement(types)

      return `COREN-${uf} ${formatted}-${type}`
    }

    async function createNurse() {
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

      const email = `nurse.${firstName}.${lastName}@yopmail.com`

      const shifts = Object.values(NurseShifts)
      const shift = faker.helpers.arrayElement(shifts)

      const nurse = {
        name,
        cpf: generateCPF(),
        email,
        password: 'fastpass',
        gender,
        cellphone: generatePhone(),
        birthDate: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
        coren: generateCoren(),
        shift
      }

      try {
        const response = await Nurse.create(nurse)
        console.log('✅ Criado:', response.coren)
      } catch (error: any) {
        console.error('❌ Erro:', error.response?.data || error.message)
      }
    }

    for (let i = 0; i < 30; i++) {
      await createNurse()
    }

    console.log('🚀 Seed de nurses finalizado')
  }
}

export default createNurses
