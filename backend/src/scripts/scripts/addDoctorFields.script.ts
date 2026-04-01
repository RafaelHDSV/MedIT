import { UserGender, UserLevels } from '../../interfaces/IUser.js'
import User from '../../models/UserModel.js'
import { Script } from '../types.js'

const addDoctorFields: Script = {
  name: 'add-doctor-fields',
  description: 'Adiciona campos específicos para médicos que não possuem',

  async run() {
    console.log('Adicionando campos específicos para médicos...')

    const filter = { level: UserLevels.DOCTOR }

    const update = {
      $set: {
        age: 58,
        gender: UserGender.MALE,
        cellphone: 15999991234,
        birthDate: new Date('1968-09-15'),
        crm: '117101',
        specialization: 'Pediatria'
      }
    }

    const result = await User.updateMany(filter, update)

    console.log(`${result.modifiedCount} médicos atualizados!`)
  }
}

export default addDoctorFields
