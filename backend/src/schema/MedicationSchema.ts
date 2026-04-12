import mongoose from 'mongoose'
import {
  IMedication,
  MedicationAvailabilityStatus,
  MedicationCategories
} from '../interfaces/IMedications.js'

const MedicationSchema = new mongoose.Schema<IMedication>(
  {
    name: {
      type: String,
      required: [true, 'O nome do medicamento é obrigatório'],
      trim: true,
      minlength: [2, 'O nome do medicamento deve ter pelo menos 2 caracteres']
    },
    category: {
      type: String,
      enum: Object.values(MedicationCategories),
      required: [true, 'A categoria do medicamento é obrigatória'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'A descrição do medicamento é obrigatória'],
      trim: true
    },
    requiresPrescription: {
      type: Boolean,
      required: [true, 'A necessidade de receita médica é obrigatória'],
      default: false
    },
    availabilityStatus: {
      type: String,
      enum: Object.values(MedicationAvailabilityStatus),
      required: [true, 'O status de disponibilidade é obrigatório'],
      trim: true
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
