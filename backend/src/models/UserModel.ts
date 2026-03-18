import bcrypt from 'bcrypt'
import mongoose, { HydratedDocument } from 'mongoose'
import { IUser, IUserMethods, Roles, UserGender } from '../interfaces/IUser.js'
import CounterModel from './CounterModel.js'

const UserSchema = new mongoose.Schema<
  IUser,
  mongoose.Model<IUser>,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: [true, 'O nome é obrigatório'],
      trim: true,
      minlength: [2, 'O nome deve ter pelo menos 2 caracteres'],
      validate: {
        validator: function (v: string) {
          return v.trim().split(' ').length >= 2
        },
        message: 'O nome deve conter pelo menos nome e sobrenome.'
      }
    },
    cpf: {
      type: String,
      required: [true, 'O CPF é obrigatório'],
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^\d{11}$/.test(v)
        },
        message: 'Por favor, insira um CPF válido (apenas números, 11 dígitos).'
      }
    },
    number: {
      type: Number,
      unique: true
    },
    role: {
      type: String,
      required: [true, 'O papel é obrigatório'],
      enum: Object.values(Roles)
    },
    email: {
      type: String,
      required: [true, 'O email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor, insira um email válido']
    },
    password: {
      type: String,
      required: [true, 'A senha é obrigatória'],
      minlength: [6, 'A senha deve ter pelo menos 6 caracteres']
    },
    age: {
      type: Number,
      min: [0, 'A idade deve ser um número positivo']
    },
    gender: {
      type: String,
      enum: Object.values(UserGender)
    },
    cellphone: {
      type: Number
    },
    birthDate: {
      type: Date
    },
    crm: {
      type: String
    },
    specialization: {
      type: String
    },
    refreshToken: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

UserSchema.pre('save', async function (this: HydratedDocument<IUser>) {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)

  if (this.password) {
    this.password = await bcrypt.hash(this.password, salt)
  }
})

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password
    return ret
  }
})

UserSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false
  return bcrypt.compare(password, this.password)
}

UserSchema.pre('save', async function (this: HydratedDocument<IUser>) {
  if (this.number) return

  const counterName = `user_${this.role}`

  const counter = await CounterModel.findOneAndUpdate(
    { name: counterName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  )

  this.number = counter.value
})

type UserModel = mongoose.Model<IUser, {}, IUserMethods>
export default mongoose.model<IUser, UserModel>('User', UserSchema)
