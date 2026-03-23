import { faker } from '@faker-js/faker'
import { DoctorSpecializations } from '../../interfaces/IDoctor.js'
import { Doctor } from '../../models/DoctorModel.js'
import { Script } from '../types.js'

const createDoctors: Script = {
  name: 'create-doctors',
  description: 'Cria 30 médicos para testes',
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

    // ✅ Gerar telefone numérico
    function generatePhone() {
      return Number('119' + faker.number.int({ min: 10000000, max: 99999999 }))
    }

    async function createDoctor() {
      const gender = faker.helpers.arrayElement(['male', 'female'])

      const name = faker.person.fullName({ sex: gender })
      const invalidNameParts = ['Mrs', 'Mr', '.', 'Miss', 'Dr']
      const nameParts = name
        .trim()
        .split(/\s+/)
        .filter((part) => !invalidNameParts.includes(part))
      const firstName = nameParts[0].toLowerCase()
      const lastName = nameParts[nameParts.length - 1].toLowerCase()
      const email = `doctor.${firstName}.${lastName}@yopmail.com`

      const specializations = Object.values(DoctorSpecializations)
      const randomSpecialization: string =
        faker.helpers.arrayElement(specializations)
      let specialization: string
      if (randomSpecialization === DoctorSpecializations.OTHER) {
        const otherSpecialization = [
          'Acupuntura',
          'Medicina Esportiva',
          'Medicina do Trabalho'
        ]
        specialization = faker.helpers.arrayElement(otherSpecialization)
      } else {
        specialization = randomSpecialization
      }

      const doctor = {
        name,
        cpf: generateCPF(),
        email,
        password: 'fastpass',
        gender,
        cellphone: generatePhone(),
        birthDate: faker.date.birthdate({ min: 18, max: 85, mode: 'age' }),
        crm: faker.number.int({ min: 100000, max: 999999 }).toString() + '/SP',
        specialization
      }

      try {
        const response = await Doctor.create(doctor)
        console.log('✅ Criado:', response)
      } catch (error: any) {
        console.error('❌ Erro:', error.response?.data || error.message)
      }
    }

    for (let i = 0; i < 30; i++) {
      await createDoctor()
    }

    console.log('🚀 Seed finalizado')
  }
}

export default createDoctors
