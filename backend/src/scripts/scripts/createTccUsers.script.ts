import { faker } from '@faker-js/faker'
import { DoctorSpecializations } from '../../interfaces/IDoctor.js'
import { NurseCorenType, NurseShifts } from '../../interfaces/INurse.js'
import { BloodType } from '../../interfaces/IPatient.js'
import { UserGender, UserLevels } from '../../interfaces/IUser.js'
import { Admin } from '../../models/AdminModel.js'
import { Doctor } from '../../models/DoctorModel.js'
import { Nurse } from '../../models/NurseModel.js'
import { Patient } from '../../models/PatientModel.js'
import UserModel from '../../models/UserModel.js'
import { Script } from '../types.js'

const createTccUsers: Script = {
  name: 'create-tcc-users',
  description: 'Cria contas para membros do TCC em todos os níveis',

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

    function generateCRM() {
      const number = Math.floor(100000 + Math.random() * 900000) // 6 dígitos
      return `${number}/SP`
    }

    async function generateUniqueCRM() {
      let crm
      let exists = true

      while (exists) {
        crm = generateCRM()
        exists = Boolean(await UserModel.findOne({ crm }))
      }

      return crm
    }

    function generateCOREN() {
      const number = Math.floor(100000 + Math.random() * 900000)
      const type = faker.helpers.arrayElement(Object.values(NurseCorenType))
      return `COREN-SP ${number}-${type}`
    }

    async function generateUniqueCOREN() {
      let coren
      let exists = true

      while (exists) {
        coren = generateCOREN()
        exists = Boolean(await UserModel.findOne({ coren }))
      }

      return coren
    }

    async function getExtraFields(level: UserLevels) {
      switch (level) {
        case UserLevels.DOCTOR:
          return {
            crm: await generateUniqueCRM(),
            specialization: faker.helpers.arrayElement(
              Object.values(DoctorSpecializations)
            )
          }

        case UserLevels.NURSE:
          return {
            coren: await generateUniqueCOREN(),
            shift: faker.helpers.arrayElement(Object.values(NurseShifts))
          }

        case UserLevels.PATIENT:
          const possibleConditions = [
            'Diabetes',
            'Hipertensão',
            'Asma',
            'Obesidade',
            'Ansiedade',
            'Depressão',
            'Doença cardíaca'
          ]

          const possibleAllergies = [
            'Penicilina',
            'Amoxicilina',
            'Dipirona',
            'Lactose',
            'Glúten',
            'Poeira',
            'Pólen'
          ]

          const weight = faker.number.int({ min: 50, max: 120 })
          const height = faker.number.float({
            min: 1.5,
            max: 2.0,
            fractionDigits: 2
          })

          return {
            weight,
            height,
            bloodType: faker.helpers.arrayElement(Object.values(BloodType)),
            conditions: faker.helpers.arrayElements(
              possibleConditions,
              faker.number.int({ min: 0, max: 3 })
            ),

            allergies: faker.helpers.arrayElements(
              possibleAllergies,
              faker.number.int({ min: 0, max: 3 })
            )
          }

        default:
          return {}
      }
    }

    const members = [
      {
        name: 'Brenda Silva',
        short: 'brenda',
        gender: UserGender.FEMALE,
        cellphone: 15991537827
      },
      {
        name: 'Évellin Simões',
        short: 'evellin',
        gender: UserGender.FEMALE,
        cellphone: 15996830782
      },
      {
        name: 'Jonatas Lima',
        short: 'jota',
        gender: UserGender.MALE,
        cellphone: 15996093112
      },
      {
        name: 'Matheus Chagas',
        short: 'take',
        gender: UserGender.MALE,
        cellphone: 15996928229
      },
      {
        name: 'Rafael Silva',
        short: 'rafa',
        gender: UserGender.MALE,
        cellphone: 15991900537
      },
      {
        name: 'Rafael Vieira',
        short: 'vieira',
        gender: UserGender.MALE,
        cellphone: 11947100007
      },
      {
        name: 'Victor Campos',
        short: 'victor',
        gender: UserGender.MALE,
        cellphone: 15998407506
      }
    ]

    const levelConfig = [
      { level: UserLevels.ADMIN, model: Admin },
      { level: UserLevels.DOCTOR, model: Doctor },
      { level: UserLevels.NURSE, model: Nurse },
      { level: UserLevels.PATIENT, model: Patient }
    ]

    async function createUser(member: any, levelItem: any) {
      const email = `${levelItem.level}.${member.short}@yopmail.com`

      try {
        const alreadyExists = await UserModel.findOne({ email })

        if (alreadyExists) {
          console.log('⚠️ Já existe:', email)
          return
        }

        const extraFields = await getExtraFields(levelItem.level)

        const userData = {
          name: member.name,
          cpf: generateCPF(),
          level: levelItem.level,
          email,
          password: 'fastpass',
          gender: member.gender,
          cellphone: member.cellphone,
          birthDate: faker.date.birthdate({ min: 18, max: 40, mode: 'age' }),
          ...extraFields
        }

        const response = await levelItem.model.create(userData)

        console.log('✅ Criado:', response.email)
      } catch (error: any) {
        console.error('❌ Erro:', email, error.message)
      }
    }

    for (const member of members) {
      for (let i = 0; i < levelConfig.length; i++) {
        await createUser(member, levelConfig[i])
      }
    }

    console.log('🚀 Seed de usuários do TCC finalizado')
  }
}

export default createTccUsers
