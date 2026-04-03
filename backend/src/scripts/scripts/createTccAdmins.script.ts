import { UserLevels } from '../../interfaces/IUser.js'
import { Admin } from '../../models/AdminModel.js'
import User from '../../models/UserModel.js'
import { Script } from '../types.js'

const createTccAdmins: Script = {
  name: 'create-tcc-admins',
  description: 'Cria contas admin para membros do TCC',
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

    const members = [
      {
        name: 'Brenda Silva',
        email: 'admin.brenda@yopmail.com',
        cellphone: 15991537827
      },
      {
        name: 'Évellin Simões',
        email: 'admin.evellin@yopmail.com',
        cellphone: 15996830782
      },
      {
        name: 'Jonatas Lima',
        email: 'admin.jota@yopmail.com',
        cellphone: 15996093112
      },
      {
        name: 'Victor Campos',
        email: 'admin.victor@yopmail.com',
        cellphone: 15998407506
      }
    ]

    async function createAdmin(member: any, index: number) {
      try {
        const alreadyExists = await User.findOne({ email: member.email })

        if (alreadyExists) {
          console.log('⚠️ Já existe:', member.email)
          return
        }

        const admin = {
          name: member.name,
          cpf: generateCPF(),
          email: member.email,
          password: 'fastpass',
          cellphone: member.cellphone,
          level: UserLevels.ADMIN,
          number: index + 4 // já tem 3 admins
        }

        const response = await Admin.create(admin)

        console.log('✅ Admin criado:', response.email)
      } catch (error: any) {
        console.error('❌ Erro:', error.message)
      }
    }

    for (let i = 0; i < members.length; i++) {
      await createAdmin(members[i], i)
    }

    console.log('🚀 Seed de admins do TCC finalizado')
  }
}

export default createTccAdmins
