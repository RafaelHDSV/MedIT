import { Schema } from 'mongoose'
import {
  AttendanceOpeningSource,
  AttendanceRisk,
  AttendanceStatus,
  IAttendance,
  IPrescribedMedication,
  PatientDisposition,
  PatientFlowNoticeKind
} from '../interfaces/IAttendance.js'
import { UserLevels } from '../interfaces/IUser.js'

const VitalSignsSchema = new Schema(
  {
    bloodPressure: { type: String },
    heartRate: { type: Number },
    temperature: { type: Number },
    oxygenSaturation: { type: Number }
  },
  { _id: false }
)

const PrescribedMedicationSchema = new Schema<IPrescribedMedication>(
  {
    name: { type: String, required: true },
    dosage: { type: String },
    frequency: { type: String },
    duration: { type: String },
    observation: { type: String }
  },
  { _id: false }
)

const AttendanceSchema = new Schema<IAttendance>(
  {
    number: {
      type: Number,
      unique: true
    },
    complaint: {
      type: String,
      required: true
    },
    diagnosisKey: {
      type: String
    },
    diagnosis: {
      type: String
    },
    diagnosisText: {
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
    unitId: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      required: true
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
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
    patientFlowNotices: [
      {
        kind: {
          type: String,
          enum: Object.values(PatientFlowNoticeKind),
          required: true
        },
        locationLabel: { type: String, required: true, maxlength: 120 },
        createdAt: { type: Date, required: true, default: Date.now },
        actorUserId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        actorLevel: {
          type: String,
          enum: Object.values(UserLevels),
          required: true
        }
      }
    ],
    vitalSigns: {
      type: VitalSignsSchema
    },
    painLevel: { type: Number },
    selfMedicated: { type: Boolean },
    symptomStartDate: { type: Date },
    symptoms: [{ type: String }],
    generalObservation: { type: String },
    conditions: [{ type: String }],
    allergies: [{ type: String }],
    patientDisposition: {
      type: String,
      enum: Object.values(PatientDisposition)
    },
    prescribedMedications: {
      type: [PrescribedMedicationSchema],
      default: undefined
    },
    prescribedExams: [{ type: String }],
    openingSource: {
      type: String,
      enum: Object.values(AttendanceOpeningSource)
    },
    openedByUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    openedByLevel: {
      type: String,
      enum: Object.values(UserLevels)
    }
  },
  {
    timestamps: true
  }
)

export default AttendanceSchema
