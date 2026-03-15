import User from '../../models/UserModel.js'
import { Script } from '../types.js'

const updateUserRoles: Script = {
  name: 'update-user-roles',
  description: 'Atualiza os papéis dos usuários no banco',

  async run() {
    console.log('Atualizando papéis dos usuários...')

    const result = await User.updateMany(
      { role: 'PACIENT' },
      { $set: { role: 'PATIENT' } }
    )

    console.log(`${result.modifiedCount} papéis atualizados!`)
  }
}

export default updateUserRoles
