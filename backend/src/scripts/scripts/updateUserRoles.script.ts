import User from '../../models/UserModel.js'
import { Script } from '../types.js'

const updateUserLevels: Script = {
  name: 'update-user-levels',
  description: 'Atualiza os níveis dos usuários no banco',

  async run() {
    const from = 'PACIENT'
    const to = 'PATIENT'

    console.log('Atualizando níveis dos usuários...')

    const result = await User.updateMany(
      { level: from },
      { $set: { level: to } }
    )

    console.log(`${result.modifiedCount} níveis atualizados!`)
  }
}

export default updateUserLevels
