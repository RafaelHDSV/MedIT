import { UserLevels } from '../../interfaces/IUser.js'
import UserModel from '../../models/UserModel.js'

const updateUserNumbers = {
  name: 'update-user-numbers',
  description:
    'Atualiza o campo number dos usuários com base na ordem de criação',
  async run() {
    const levels = [
      UserLevels.DOCTOR,
      UserLevels.NURSE,
      UserLevels.PATIENT,
      UserLevels.ADMIN
    ]

    for (const level of levels) {
      const users = await UserModel.find({ level }).sort({ createdAt: 1 })

      let counter = 1

      for (const user of users) {
        await UserModel.updateOne(
          { _id: user._id },
          { $set: { number: counter } }
        )

        counter++
      }

      console.log(`✅ ${level} atualizado`)
    }

    process.exit()
  }
}

export default updateUserNumbers
