import mongoose from 'mongoose'
import { IUnit } from '../interfaces/IUnit.js'

const UnitSchema = new mongoose.Schema<IUnit>(
  {
    name: {
      type: String,
      required: [true, 'O nome da unidade é obrigatório'],
      trim: true,
      minlength: [2, 'O nome da unidade deve ter pelo menos 2 caracteres']
    },
    address: {
      type: String,
      required: [true, 'O endereço da unidade é obrigatório'],
      trim: true
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'A capacidade máxima da unidade é obrigatória'],
      min: [1, 'A capacidade máxima deve ser pelo menos 1']
    },
    openingHours: {
      type: Map,
      of: {
        open: { type: String, required: true },
        close: { type: String, required: true }
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^\d{10,11}$/.test(v)
        },
        message:
          'Por favor, insira um telefone válido (apenas números, 10 ou 11 dígitos).'
      }
    }
  },
  { timestamps: true }
)

export type UnitModel = mongoose.Model<IUnit>
export default mongoose.model<IUnit, UnitModel>('Unit', UnitSchema)
