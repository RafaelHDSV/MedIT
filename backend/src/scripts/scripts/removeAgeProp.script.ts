import UserModel from '../../models/UserModel.js'

const removeAgeProp = {
  name: 'removeAgeProp',
  description: 'Remove a propriedade age dos usuários',
  async run() {
    const result = await UserModel.updateMany(
      { age: { $exists: true } },
      { $unset: { age: 1 } }
    )

    console.log(`✅ ${result.modifiedCount} usuários atualizados`)

    process.exit()
  }
}

export default removeAgeProp
