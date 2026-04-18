import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { AttendanceStatus } from '../interfaces/IAttendance.js'
import { UserLevels } from '../interfaces/IUser.js'
import { Attendance } from '../models/AttendanceModel.js'
import User from '../models/UserModel.js'

const historyEntry = (status: AttendanceStatus) => ({
  status,
  changedAt: new Date()
})

const paramId = (value: string | string[] | undefined) =>
  String(Array.isArray(value) ? value[0] : value)

export const claimTriage = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.NURSE) {
      return res
        .status(403)
        .json({ message: 'Apenas enfermeiros podem assumir a triagem.' })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const filter = {
      _id: new Types.ObjectId(attendanceId),
      unitId: user.unitId,
      status: AttendanceStatus.WAITING_TRIAGE,
      $or: [{ nurseId: null }, { nurseId: { $exists: false } }]
    }

    const updated = await Attendance.findOneAndUpdate(
      filter as never,
      {
        $set: {
          nurseId: user._id,
          status: AttendanceStatus.IN_TRIAGE
        },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.IN_TRIAGE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Este atendimento não está mais disponível na fila (já assumido ou status alterado).'
      })
    }

    return res.json({
      message: 'Triagem iniciada com sucesso.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao assumir a triagem.' })
  }
}

export const completeTriage = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.NURSE) {
      return res.status(403).json({
        message: 'Apenas enfermeiros podem concluir a triagem.'
      })
    }

    const triageFilter = {
      _id: new Types.ObjectId(attendanceId),
      nurseId: user._id,
      status: AttendanceStatus.IN_TRIAGE
    }

    const updated = await Attendance.findOneAndUpdate(
      triageFilter as never,
      {
        $set: {
          status: AttendanceStatus.WAITING_ATTENDANCE
        },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.WAITING_ATTENDANCE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Não foi possível concluir a triagem. Verifique se você é a enfermeira responsável e se o atendimento está em triagem.'
      })
    }

    return res.json({
      message: 'Triagem concluída. O paciente segue para a fila médica.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao concluir a triagem.' })
  }
}

export const claimDoctorConsult = async (req: Request, res: Response) => {
  try {
    const attendanceId = paramId(req.params.attendanceId)
    if (!Types.ObjectId.isValid(attendanceId)) {
      return res.status(400).json({ message: 'ID do atendimento inválido.' })
    }

    const user = await User.findById(req.userId)
    if (!user || user.level !== UserLevels.DOCTOR) {
      return res
        .status(403)
        .json({ message: 'Apenas médicos podem assumir o atendimento.' })
    }
    if (!user.unitId) {
      return res.status(400).json({ message: 'Usuário sem unidade vinculada.' })
    }

    const doctorFilter = {
      _id: new Types.ObjectId(attendanceId),
      unitId: user.unitId,
      status: AttendanceStatus.WAITING_ATTENDANCE,
      $or: [{ doctorId: null }, { doctorId: { $exists: false } }]
    }

    const updated = await Attendance.findOneAndUpdate(
      doctorFilter as never,
      {
        $set: {
          doctorId: user._id,
          status: AttendanceStatus.IN_ATTENDANCE
        },
        $push: {
          changesHistory: historyEntry(AttendanceStatus.IN_ATTENDANCE)
        }
      },
      { new: true }
    )

    if (!updated) {
      return res.status(409).json({
        message:
          'Este atendimento não está mais disponível na fila (já assumido ou status alterado).'
      })
    }

    return res.json({
      message: 'Atendimento iniciado com sucesso.',
      data: updated
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao assumir o atendimento.' })
  }
}
