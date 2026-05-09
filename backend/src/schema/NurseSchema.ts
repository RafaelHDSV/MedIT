import mongoose from 'mongoose'
import { INurse, NurseShifts } from '../interfaces/INurse.js'

const NurseSchema = new mongoose.Schema<INurse>({
  coren: { type: String, required: true, unique: true },
  shift: { type: String, enum: Object.values(NurseShifts), required: true },
  workLocationLabel: {
    type: String,
    trim: true,
    maxlength: 120
  }
})

export default NurseSchema
