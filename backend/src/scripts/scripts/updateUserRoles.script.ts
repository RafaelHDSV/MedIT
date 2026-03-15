import User from '../../models/UserModel.js'
import { Script } from '../types.js'

const updateUserRoles: Script = {
  name: 'update-user-roles',
  description: 'Atualiza os papéis dos usuários no banco',

  async run() {
    const from = 'PACIENT'
    const to = 'PATIENT'

    console.log('Atualizando papéis dos usuários...')

    const result = await User.updateMany({ role: from }, { $set: { role: to } })

    console.log(`${result.modifiedCount} papéis atualizados!`)
  }
}

export default updateUserRoles
