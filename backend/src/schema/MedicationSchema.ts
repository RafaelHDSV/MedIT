import mongoose from 'mongoose'
import {
  IMedication,
  MedicationAvailabilityStatus
} from '../interfaces/IMedications.js'

const MedicationSchema = new mongoose.Schema<IMedication>(
  {
    name: {
      type: String,
      required: [true, 'O nome do medicamento é obrigatório'],
      trim: true,
      minlength: [2, 'O nome do medicamento deve ter pelo menos 2 caracteres']
    },
    dosage: {
      type: String,
      required: [true, 'A dosagem do medicamento é obrigatória'],
      trim: true
    },
    frequency: {
      type: String,
      required: [true, 'A frequência do medicamento é obrigatória'],
      trim: true
    },
    route: {
      type: String,
      required: [true, 'A via de administração do medicamento é obrigatória'],
      trim: true
    },
    duration: {
      type: String,
      required: [true, 'A duração do tratamento é obrigatória'],
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
      enum: Object.values(MedicationAvailabilityStatus),
      default: MedicationAvailabilityStatus.UNAVAILABLE
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

export default MedicationSchema
