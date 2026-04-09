import User from '../../models/UserModel.js'
import { Script } from '../types.js'

const updateRoleToLevel: Script = {
  name: 'update-role-to-level',
  description: "Atualiza o campo 'role' para 'level' em todos os usuários",

  async run() {
    console.log("🔄 Atualizando campo 'role' para 'level'...")

    const result = await User.updateMany(
      { role: { $exists: true } },
      [
        {
          $set: {
            level: '$role'
          }
        },
        {
          $unset: 'role'
        }
      ],
      { updatePipeline: true }
    )

    console.log(`✅ ${result.modifiedCount} usuários atualizados`)
  }
}

export default updateRoleToLevel
