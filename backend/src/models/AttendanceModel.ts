import { model } from 'mongoose'
import { IAttendance } from '../interfaces/IAttendance'
import AttendanceSchema from '../schema/AttendanceSchema'

export const Attendance = model<IAttendance>('Attendance', AttendanceSchema)
