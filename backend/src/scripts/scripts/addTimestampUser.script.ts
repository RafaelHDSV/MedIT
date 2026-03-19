import UserModel from '../../models/UserModel.js'
import { Script } from '../types.js'

const addTimestampUser: Script = {
  name: 'add-timestamp-user',
  description:
    'Adiciona o campo createdAt e updatedAt para os usuários que não possuem',

  async run() {
    console.log('Adicionando campos createdAt e updatedAt para os usuários...')

    const now = new Date()

    const filterCreated = {
      $or: [{ createdAt: { $exists: false } }, { createdAt: null }]
    }

    const filterUpdated = {
      $or: [{ updatedAt: { $exists: false } }, { updatedAt: null }]
    }

    const createdAtCount = await UserModel.countDocuments(filterCreated)
    console.log(`Usuários sem createdAt: ${createdAtCount}`)
    const updatedAtCount = await UserModel.countDocuments(filterUpdated)
    console.log(`Usuários sem updatedAt: ${updatedAtCount}`)

    const results = await Promise.all([
      UserModel.updateMany(
        filterCreated,
        { $set: { createdAt: now } },
        { timestamps: false }
      ),
      UserModel.updateMany(
        filterUpdated,
        { $set: { updatedAt: now } },
        { timestamps: false }
      )
    ])

    const total = results.reduce(
      (acc, cur) => acc + (cur.modifiedCount ?? 0),
      0
    )

    console.log(`${total} usuários atualizados!`)
  }
}

export default addTimestampUser
