import mongoose from 'mongoose'
import { UserLevels } from '../../interfaces/IUser.js'
import { Attendance } from '../../models/AttendanceModel.js'
import { Unit } from '../../models/UnitModel.js'
import User from '../../models/UserModel.js'
import { Script } from '../types.js'

const linkUnitsToAttendances: Script = {
  name: 'link-units-to-attendances',
  description:
    'Distribui atendimentos entre unidades e garante que médico, enfermeiro e paciente referenciam a mesma unidade. Usuários não são alterados.',

  async run() {
    // ------------------------------------------------------------------ //
    //  1. Carrega dados
    // ------------------------------------------------------------------ //
    const units = await Unit.find().sort({ createdAt: 1 })
    const attendances = await Attendance.find().sort({ number: 1 })

    console.log(
      `\n🏥 ${units.length} unidades | 📋 ${attendances.length} atendimentos\n`
    )

    if (units.length === 0) {
      console.error(
        '❌ Nenhuma unidade encontrada. Execute o seed de unidades primeiro.'
      )
      process.exit(1)
    }

    // ------------------------------------------------------------------ //
    //  2. Pré-carrega os usuários por unidade (evita N+1 queries)
    // ------------------------------------------------------------------ //
    type UserDoc = {
      _id: mongoose.Types.ObjectId
      unitId?: mongoose.Types.ObjectId
      level: string
    }

    const allUsers = (await User.find(
      {
        level: {
          $in: [UserLevels.DOCTOR, UserLevels.NURSE, UserLevels.PATIENT]
        }
      },
      { _id: 1, unitId: 1, level: 1 }
    )) as UserDoc[]

    // Mapeia level → unitId → lista de _ids disponíveis
    const poolByLevelAndUnit = new Map<
      string,
      Map<string, mongoose.Types.ObjectId[]>
    >()

    for (const user of allUsers) {
      if (!user.unitId) continue
      const levelKey = user.level
      const unitKey = user.unitId.toString()

      if (!poolByLevelAndUnit.has(levelKey)) {
        poolByLevelAndUnit.set(levelKey, new Map())
      }
      const unitMap = poolByLevelAndUnit.get(levelKey)!
      if (!unitMap.has(unitKey)) unitMap.set(unitKey, [])
      unitMap.get(unitKey)!.push(user._id)
    }

    // Helper: retorna o próximo usuário disponível de um nível/unidade (round-robin)
    const cursors = new Map<string, number>() // `level:unitId` → índice atual

    function pickUser(
      level: string,
      unitId: string
    ): mongoose.Types.ObjectId | null {
      const pool = poolByLevelAndUnit.get(level)?.get(unitId)
      if (!pool || pool.length === 0) return null
      const key = `${level}:${unitId}`
      const idx = cursors.get(key) ?? 0
      cursors.set(key, (idx + 1) % pool.length)
      return pool[idx]
    }

    // ------------------------------------------------------------------ //
    //  3. Distribui atendimentos (round-robin por unidade com menor carga)
    // ------------------------------------------------------------------ //
    const unitCounts = new Map<string, number>()
    for (const unit of units) unitCounts.set(unit._id.toString(), 0)

    let updated = 0
    let warnings = 0

    for (const attendance of attendances) {
      // Unidade com menor número de atendimentos
      let minCount = Infinity
      let targetUnit = units[0]
      for (const unit of units) {
        const count = unitCounts.get(unit._id.toString()) ?? 0
        if (count < minCount) {
          minCount = count
          targetUnit = unit
        }
      }

      const unitId = targetUnit._id
      const unitIdStr = unitId.toString()

      // ---------------------------------------------------------------- //
      //  4. Resolve médico, enfermeiro e paciente para a unidade alvo
      //     Mantém o original se já pertence à unidade; troca caso contrário
      // ---------------------------------------------------------------- //
      const resolveUser = (
        currentId: mongoose.Types.ObjectId | undefined,
        level: string,
        label: string,
        attendanceNumber?: number
      ): { id: mongoose.Types.ObjectId | undefined; swapped: boolean } => {
        if (!currentId) return { id: undefined, swapped: false }

        const currentUser = allUsers.find(
          (u) => u._id.toString() === currentId.toString()
        )
        if (currentUser?.unitId?.toString() === unitIdStr) {
          return { id: currentId, swapped: false }
        }

        // Unidade divergente → troca por alguém da unidade alvo
        const replacement = pickUser(level, unitIdStr)
        if (!replacement) {
          console.warn(
            `   ⚠️  Sem ${label} disponível na unidade ${targetUnit.name} — mantendo original`
          )
          warnings++
          return { id: currentId, swapped: false }
        }

        console.log(
          `   🔄 Atendimento #${attendanceNumber}: ${label} trocado (unidade diferente)`
        )
        return { id: replacement, swapped: true }
      }

      const doctor = resolveUser(
        attendance.doctorId,
        UserLevels.DOCTOR,
        'médico',
        attendance.number
      )
      const nurse = resolveUser(
        attendance.nurseId,
        UserLevels.NURSE,
        'enfermeiro',
        attendance.number
      )
      const patient = resolveUser(
        attendance.patientId,
        UserLevels.PATIENT,
        'paciente',
        attendance.number
      )

      // ---------------------------------------------------------------- //
      //  5. Atualiza somente o atendimento
      // ---------------------------------------------------------------- //
      await Attendance.findByIdAndUpdate(attendance._id, {
        $set: {
          unitId,
          ...(doctor.id && { doctorId: doctor.id }),
          ...(nurse.id && { nurseId: nurse.id }),
          ...(patient.id && { patientId: patient.id })
        }
      })

      unitCounts.set(unitIdStr, minCount + 1)
      updated++

      console.log(
        `✅ Atendimento #${attendance.number}  →  ${targetUnit.name}` +
          `${doctor.swapped ? '  | médico 🔄' : doctor.id ? '  | médico ✓' : ''}` +
          `${nurse.swapped ? '  | enfermeiro 🔄' : nurse.id ? '  | enfermeiro ✓' : ''}` +
          `${patient.swapped ? '  | paciente 🔄' : patient.id ? '  | paciente ✓' : ''}`
      )
    }

    // ------------------------------------------------------------------ //
    //  6. Resumo final
    // ------------------------------------------------------------------ //
    console.log('\n📊 Atendimentos por unidade:\n')
    for (const unit of units) {
      const count = await Attendance.countDocuments({ unitId: unit._id })
      console.log(`   ${unit.name}: ${count} atendimento(s)`)
    }

    console.log(`\n✅ ${updated} atendimento(s) atualizados`)
    if (warnings > 0)
      console.log(
        `⚠️  ${warnings} aviso(s) — verifique unidades sem profissionais suficientes`
      )
    console.log('\n🎉 Seed de atendimentos concluído!\n')

    process.exit()
  }
}

export default linkUnitsToAttendances
