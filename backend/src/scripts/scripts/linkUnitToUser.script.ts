import { UserLevels } from '../../interfaces/IUser.js'
import { Admin } from '../../models/AdminModel.js'
import { Unit } from '../../models/UnitModel.js'
import User from '../../models/UserModel.js'
import { Script } from '../types.js'

// Admins extras para cobrir as unidades sem responsável
const EXTRA_ADMINS = [
  {
    name: 'Carlos Eduardo Mendes',
    email: 'admin.carlos@yopmail.com',
    cellphone: 15992110001
  },
  {
    name: 'Fernanda Costa Ribeiro',
    email: 'admin.fernanda@yopmail.com',
    cellphone: 15992110002
  },
  {
    name: 'Lucas Almeida Torres',
    email: 'admin.lucas@yopmail.com',
    cellphone: 15992110003
  },
  {
    name: 'Mariana Oliveira Souza',
    email: 'admin.mariana@yopmail.com',
    cellphone: 15992110004
  },
  {
    name: 'Paulo Henrique Gomes',
    email: 'admin.paulo@yopmail.com',
    cellphone: 15992110005
  }
]

function generateCPF(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10))
  const calcDigit = (base: number[]) => {
    const sum = base.reduce(
      (acc, num, i) => acc + num * (base.length + 1 - i),
      0
    )
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  digits.push(calcDigit(digits))
  digits.push(calcDigit(digits))
  return digits.join('')
}

// Extrai a parte "nome" de emails no padrão level.nome@yopmail.com
function extractNomeFromEmail(email: string): string | null {
  const match = email.match(/^[^.]+\.([^@]+)@yopmail\.com$/)
  return match ? match[1] : null
}

const linkUnitsToUsers: Script = {
  name: 'link-units-to-users',
  description:
    'Vincula unidades aos usuários: um admin por unidade, grupos por padrão de e-mail e distribuição equalizada para os demais',

  async run() {
    // ------------------------------------------------------------------ //
    //  1. Carrega unidades
    // ------------------------------------------------------------------ //
    const units = await Unit.find().sort({ createdAt: 1 })
    console.log(`\n🏥 ${units.length} unidades encontradas\n`)

    // ------------------------------------------------------------------ //
    //  2. Garante que há admins suficientes (1 por unidade)
    // ------------------------------------------------------------------ //
    let admins = await User.find({ level: UserLevels.ADMIN }).sort({
      number: 1
    })
    console.log(`👤 ${admins.length} administrador(es) encontrado(s)`)

    const adminsNeeded = units.length - admins.length

    if (adminsNeeded > 0) {
      console.log(`\n➕ Criando ${adminsNeeded} admin(s) extra(s)...\n`)

      const lastAdmin = await User.findOne({ level: UserLevels.ADMIN }).sort({
        number: -1
      })
      let nextNumber = (lastAdmin?.number ?? 0) + 1

      for (let i = 0; i < adminsNeeded; i++) {
        const member = EXTRA_ADMINS[i]

        if (!member) {
          console.error(
            `❌ Não há admins extras suficientes definidos em EXTRA_ADMINS`
          )
          break
        }

        const alreadyExists = await User.findOne({ email: member.email })
        if (alreadyExists) {
          console.log(`⚠️  Já existe: ${member.email}`)
          nextNumber++
          continue
        }

        await Admin.create({
          name: member.name,
          cpf: generateCPF(),
          email: member.email,
          password: 'fastpass',
          cellphone: member.cellphone,
          level: UserLevels.ADMIN,
          number: nextNumber++
        })

        console.log(`✅ Admin criado: ${member.email}`)
      }

      admins = await User.find({ level: UserLevels.ADMIN }).sort({ number: 1 })
    }

    // ------------------------------------------------------------------ //
    //  3. Vincula cada admin a uma unidade (1:1)
    // ------------------------------------------------------------------ //
    console.log('\n🔗 Vinculando admins às unidades...\n')

    const adminUnitMap = new Map<string, string>() // nome → unitId

    for (let i = 0; i < units.length; i++) {
      const admin = admins[i]
      const unit = units[i]

      await User.findByIdAndUpdate(admin._id, { $set: { unitId: unit._id } })

      const nome = extractNomeFromEmail(admin.email)
      if (nome) adminUnitMap.set(nome, unit._id.toString())

      console.log(`✅ ${admin.email}  →  ${unit.name}`)
    }

    // ------------------------------------------------------------------ //
    //  4. Agrupa usuários pelo padrão level.nome@yopmail.com
    // ------------------------------------------------------------------ //
    console.log('\n👥 Agrupando usuários por padrão de e-mail...\n')

    const nonAdmins = await User.find({
      level: { $ne: UserLevels.ADMIN },
      email: { $regex: /@yopmail\.com$/ }
    })

    const assignedIds = new Set<string>()

    for (const user of nonAdmins) {
      const nome = extractNomeFromEmail(user.email)
      if (!nome) continue

      const unitId = adminUnitMap.get(nome)
      if (!unitId) continue

      await User.findByIdAndUpdate(user._id, { $set: { unitId } })
      assignedIds.add(user._id.toString())

      const unitName =
        units.find((u) => u._id.toString() === unitId)?.name ?? unitId
      console.log(`✅ ${user.email}  →  ${unitName}`)
    }

    // ------------------------------------------------------------------ //
    //  5. Distribui os usuários restantes de forma equalizada
    //     Inclui quem tem unitId apontando para unidade inexistente
    // ------------------------------------------------------------------ //
    console.log('\n🔀 Distribuindo usuários restantes...\n')

    const validUnitIds = units.map((u) => u._id.toString())

    // Busca todos os não-admins ainda não atribuídos na etapa anterior
    const allNonAdmins = await User.find({ level: { $ne: UserLevels.ADMIN } })

    const remaining = allNonAdmins.filter((user) => {
      if (assignedIds.has(user._id.toString())) return false
      const uid = user.unitId?.toString()
      // Inclui quem não tem unitId ou tem referência inválida
      return !uid || !validUnitIds.includes(uid)
    })

    if (remaining.length === 0) {
      console.log('ℹ️  Nenhum usuário restante para distribuir')
    }

    // Conta quantos usuários cada unidade já possui
    const unitCounts = new Map<string, number>()
    for (const unit of units) {
      const count = await User.countDocuments({ unitId: unit._id })
      unitCounts.set(unit._id.toString(), count)
    }

    for (const user of remaining) {
      // Escolhe a unidade com menor número de usuários no momento
      let minCount = Infinity
      let targetUnit = units[0]

      for (const unit of units) {
        const count = unitCounts.get(unit._id.toString()) ?? 0
        if (count < minCount) {
          minCount = count
          targetUnit = unit
        }
      }

      await User.findByIdAndUpdate(user._id, {
        $set: { unitId: targetUnit._id }
      })
      unitCounts.set(targetUnit._id.toString(), minCount + 1)

      console.log(`✅ ${user.email}  →  ${targetUnit.name}`)
    }

    // ------------------------------------------------------------------ //
    //  6. Resumo final
    // ------------------------------------------------------------------ //
    console.log('\n📊 Distribuição final por unidade:\n')

    for (const unit of units) {
      const count = await User.countDocuments({ unitId: unit._id })
      console.log(`   ${unit.name}: ${count} usuário(s)`)
    }

    console.log('\n🎉 Seed de vínculo concluído!\n')

    process.exit()
  }
}

export default linkUnitsToUsers
