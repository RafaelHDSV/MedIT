import mongoose from 'mongoose'
import { IMedication, MaterialAvailabilityStatus } from '../interfaces/IMedication.js'

const MedicationSchema = new mongoose.Schema<IMedication>(
  {
    name: {
      type: String,
      required: [true, 'O nome do medicamento é obrigatório'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'A categoria do medicamento é obrigatória'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    requiresPrescription: {
      type: Boolean,
      default: false
    },
    availabilityStatus: {
      type: String,
      enum: Object.values(MaterialAvailabilityStatus),
      default: MaterialAvailabilityStatus.UNAVAILABLE
    },
    stockQuantity: {
      type: Number,
      required: [true, 'A quantidade em estoque é obrigatória'],
      min: [0, 'A quantidade em estoque não pode ser negativa']
    },
    unitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Unit',
      required: [true, 'A unidade é obrigatória']
    }
  },
  { timestamps: true }
)

export type MedicationModel = mongoose.Model<IMedication>
export default mongoose.model<IMedication, MedicationModel>('Medication', MedicationSchema)
