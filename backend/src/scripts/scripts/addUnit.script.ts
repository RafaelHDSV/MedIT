import { Unit } from '../../models/UnitModel.js'
import User from '../../models/UserModel.js'

const addUnit = {
  name: 'addUnit',
  description: 'Adiciona uma nova unidade ao banco de dados',
  async run() {
    const unit = await Unit.create({
      name: 'Unidade Central',
      address: 'Rua Principal, 123',
      maxOccupancy: 100,
      openingHours: {
        mon: { open: '08:00', close: '18:00' },
        tue: { open: '08:00', close: '18:00' },
        wed: { open: '08:00', close: '18:00' },
        thu: { open: '08:00', close: '18:00' },
        fri: { open: '08:00', close: '18:00' },
        sat: { open: '09:00', close: '14:00' },
        sun: { open: '09:00', close: '14:00' }
      },
      phone: '11987654321'
    })

    if (unit) {
      console.log('✅ Unidade criada com sucesso:', unit)
    } else {
      console.log('❌ Falha ao criar a unidade')
    }

    const users = await User.updateMany({}, { $set: { unitId: unit._id } })
    console.log(
      `✅ ${users.modifiedCount} usuários atualizados com a nova unidade`
    )

    process.exit()
  }
}

export default addUnit
