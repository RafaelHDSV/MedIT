import UserModel from '../../models/UserModel.js'

const levelMap: Record<string, string> = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PATIENT: 'patient'
}

const genderMap: Record<string, string> = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
}

const migrateUserEnums = {
  name: 'migrateUserEnums',
  description:
    'Migra os campos de enumeração de usuários para os novos valores',
  async run() {
    {
      try {
        const users = await UserModel.find()

        let updatedCount = 0

        for (const user of users) {
          let updated = false

          // 🔄 LEVEL
          if (user.level && levelMap[user.level]) {
            user.level = levelMap[user.level] as any
            updated = true
          }

          // 🔄 GENDER
          if (user.gender && genderMap[user.gender]) {
            user.gender = genderMap[user.gender] as any
            updated = true
          }

          if (updated) {
            await user.save()
            updatedCount++
            console.log(`✅ Atualizado usuário ${user._id}`)
          }
        }

        console.log(
          `🎉 Migração concluída. ${updatedCount} usuários atualizados.`
        )
        process.exit(0)
      } catch (err) {
        console.error('❌ Erro na migração:', err)
        process.exit(1)
      }
    }
  }
}

export default migrateUserEnums