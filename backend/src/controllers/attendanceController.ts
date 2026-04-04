import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Attendance } from '../models/AttendanceModel.js'

export const getAttendances = async (req: Request, res: Response) => {
  const { doctorId } = req.query

  try {
    const attendances = await Attendance.aggregate([
      { $match: { doctorId: new Types.ObjectId(String(doctorId)) } },
      {
        $lookup: {
          from: 'users',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patient'
        }
      },
      { $unwind: { path: '$patient', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ['$patient.name', null] },
          birthDate: { $ifNull: ['$patient.birthDate', null] },
          number: 1,
          complaint: 1,
          diagnosis: 1,
          date: 1,
          risk: 1,
          status: 1
        }
      }
    ])

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({ message: 'Nenhum atendimento encontrado' })
    }

    res.json(attendances)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Erro ao buscar os atendimentos' })
  }
}
