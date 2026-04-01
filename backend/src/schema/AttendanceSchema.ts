import { Schema } from 'mongoose'
import {
  AttendanceRisk,
  AttendanceStatus,
  IAttendance
} from '../interfaces/IAttendance.js'

const VitalSignsSchema = new Schema(
  {
    bloodPressure: { type: String },
    heartRate: { type: Number },
    temperature: { type: Number },
    oxygenSaturation: { type: Number }
  },
  { _id: false }
)

const AttendanceSchema = new Schema<IAttendance>(
  {
    complaint: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    risk: {
      type: String,
      enum: Object.values(AttendanceRisk),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      default: AttendanceStatus.ON_THE_WAY
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true
    },
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: true
    },
    nurseId: {
      type: Schema.Types.ObjectId,
      ref: 'Nurse'
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    medicationsIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Medication'
      }
    ],
    changesHistory: [
      {
        status: {
          type: String,
          enum: Object.values(AttendanceStatus),
          required: true
        },
        changedAt: {
          type: Date,
          required: true,
          default: Date.now
        }
      }
    ],
    vitalSigns: {
      type: VitalSignsSchema
    },
    iaConditionId: {
      type: Schema.Types.ObjectId,
      ref: 'IACondition'
    }
  },
  {
    timestamps: true
  }
)

export default AttendanceSchema
