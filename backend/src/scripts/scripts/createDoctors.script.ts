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

      const doctor = {
        name: faker.person.fullName(),
        cpf: generateCPF(),
        email: faker.internet.email().toLowerCase(),
        password: '123456',
        gender,
        cellphone: generatePhone(),
        birthDate: faker.date.birthdate({ min: 25, max: 65, mode: 'age' }),
        crm: faker.number.int({ min: 100000, max: 999999 }).toString(),
        specialization: faker.helpers.arrayElement(
          Object.values(DoctorSpecializations)
        )
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
