import { Attendance } from '../../models/AttendanceModel.js'

const addNumberToAttendances = {
  name: 'add-number-to-attendances',
  description:
    'Adiciona número sequencial humanizado aos atendimentos existentes',

  async run() {
    console.log('🚀 Adicionando número aos atendimentos...')

    const attendances = await Attendance.find({ number: { $exists: false } })
      .sort({ date: 1 }) // ordem cronológica → números fazem sentido temporal
      .lean()

    if (!attendances.length) {
      console.log('✅ Todos os atendimentos já possuem número')
      process.exit()
    }

    console.log(`📦 ${attendances.length} atendimentos sem número encontrados`)

    const bulkOps = attendances.map((attendance, index) => ({
      updateOne: {
        filter: { _id: attendance._id },
        update: { $set: { number: index + 1 } }
      }
    }))

    await Attendance.bulkWrite(bulkOps)

    console.log('✅ Números adicionados com sucesso!')
    process.exit()
  }
}

export default addNumberToAttendances
