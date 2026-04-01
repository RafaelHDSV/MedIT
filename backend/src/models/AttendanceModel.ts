import { model } from 'mongoose'
import { IAttendance } from '../interfaces/IAttendance.js'
import AttendanceSchema from '../schema/AttendanceSchema.js'

export const Attendance = model<IAttendance>('Attendance', AttendanceSchema)
