import UserModel from '../../models/UserModel.js'

const updateUserNumbers = {
  name: 'update-user-numbers',
  description:
    'Atualiza o campo number dos usuários com base na ordem de criação',
  async run() {
    const roles = ['DOCTOR', 'NURSE', 'PATIENT', 'ADMIN']

    for (const role of roles) {
      const users = await UserModel.find({ role }).sort({ createdAt: 1 })

      let counter = 1

      for (const user of users) {
        await UserModel.updateOne(
          { _id: user._id },
          { $set: { number: counter } }
        )

        counter++
      }

      console.log(`✅ ${role} atualizado`)
    }

    process.exit()
  }
}

export default updateUserNumbers