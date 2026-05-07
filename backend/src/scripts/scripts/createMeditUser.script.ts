import { input, password } from '@inquirer/prompts'
import { UserLevels } from '../../interfaces/IUser.js'
import User from '../../models/UserModel.js'
import { Script } from '../types.js'

function generateCPF() {
  const cpf = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))

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

const createMeditUser: Script = {
  name: 'create-medit-user',
  description: 'Cria o único usuário nível MedIT (operador da plataforma)',
  async run() {
    const existing = await User.findOne({ level: UserLevels.MEDIT })

    if (existing) {
      console.log(
        `⚠️  Já existe um usuário MedIT: ${existing.email} (ID: ${existing._id})`
      )
      console.log('   Apenas um usuário MedIT é permitido no sistema.')
      return
    }

    console.log('\n📋 Criação do usuário MedIT (operador da plataforma)\n')

    const name = await input({
      message: 'Nome completo:',
      validate: (v) =>
        v.trim().length >= 3 || 'Nome deve ter pelo menos 3 caracteres'
    })

    const email = await input({
      message: 'E-mail:',
      validate: (v) =>
        /^\S+@\S+\.\S+$/.test(v.trim()) || 'E-mail inválido'
    })

    const emailExists = await User.findOne({
      email: email.trim().toLowerCase()
    })
    if (emailExists) {
      console.log(`❌ E-mail "${email}" já está em uso por outro usuário.`)
      return
    }

    const pwd = await password({
      message: 'Senha (mín. 6 caracteres):',
      validate: (v) => v.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
    })

    try {
      const meditUser = new User({
        name: name.trim(),
        cpf: generateCPF(),
        email: email.trim().toLowerCase(),
        password: pwd,
        level: UserLevels.MEDIT
      })

      await meditUser.save()
      console.log(`\n✅ Usuário MedIT criado com sucesso: ${meditUser.email}`)
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]
        console.log(`❌ Erro de duplicidade: ${field} já está em uso.`)
      } else {
        console.error('❌ Erro ao criar usuário MedIT:', error.message)
      }
    }
  }
}

export default createMeditUser
