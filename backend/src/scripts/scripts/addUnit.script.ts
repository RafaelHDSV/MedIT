import UnitModel from '../../models/UnitModel'
import UserModel from '../../models/UserModel'

const addUnit = {
  name: 'addUnit',
  description: 'Adiciona uma nova unidade ao banco de dados',
  async run() {
    const unit = await UnitModel.create({
      name: 'Unidade Central',
      address: 'Rua Principal, 123',
      maxOccupancy: 100,
      openingHours: {
        Monday: [{ open: '08:00', close: '18:00' }],
        Tuesday: [{ open: '08:00', close: '18:00' }],
        Wednesday: [{ open: '08:00', close: '18:00' }],
        Thursday: [{ open: '08:00', close: '18:00' }],
        Friday: [{ open: '08:00', close: '18:00' }],
        Saturday: [{ open: '09:00', close: '14:00' }],
        Sunday: []
      },
      phone: '11987654321'
    })

    if (unit) {
      console.log('✅ Unidade criada com sucesso:', unit)
    } else {
      console.log('❌ Falha ao criar a unidade')
    }

    const users = await UserModel.updateMany(
      { unitId: { $exists: false } },
      { $set: { unitId: unit._id } }
    )
    console.log(`✅ ${users.modifiedCount} usuários atualizados com a nova unidade`)

    process.exit()
  }
}

export default addUnit
