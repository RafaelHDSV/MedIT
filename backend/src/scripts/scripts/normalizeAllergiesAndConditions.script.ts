import { Patient } from '../../models/PatientModel.js'
import { Script } from '../types.js'

const normalizeAllergiesAndConditions: Script = {
  name: 'normalize-allergies-conditions',
  description:
    'Separa valores de allergies e conditions que estão como string com vírgula em arrays corretos',

  async run() {
    console.log('Normalizando allergies e conditions...')

    const patients = await Patient.find({
      $or: [
        { allergies: { $elemMatch: { $regex: ',' } } },
        { conditions: { $elemMatch: { $regex: ',' } } }
      ]
    })

    let count = 0

    for (const patient of patients) {
      let updated = false

      // Normalizar allergies
      if (patient.allergies?.length) {
        const newAllergies = patient.allergies
          .flatMap((item: string) => item.split(',').map((i) => i.trim()))
          .filter(Boolean)

        if (
          JSON.stringify(newAllergies) !== JSON.stringify(patient.allergies)
        ) {
          patient.allergies = newAllergies
          updated = true
        }
      }

      // Normalizar conditions
      if (patient.conditions?.length) {
        const newConditions = patient.conditions
          .flatMap((item: string) => item.split(',').map((i) => i.trim()))
          .filter(Boolean)

        if (
          JSON.stringify(newConditions) !== JSON.stringify(patient.conditions)
        ) {
          patient.conditions = newConditions
          updated = true
        }
      }

      if (updated) {
        await patient.save()
        count++
      }
    }

    console.log(`${count} usuários atualizados!`)
  }
}

export default normalizeAllergiesAndConditions
