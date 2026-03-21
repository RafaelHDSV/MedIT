import bcrypt from 'bcrypt'
import mongoose, { HydratedDocument } from 'mongoose'
import {
  IBaseUser,
  IUserMethods,
  UserGender,
  UserLevels
} from '../interfaces/IUser.js'

const UserSchema = new mongoose.Schema<
  IBaseUser,
  mongoose.Model<IBaseUser>,
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
    level: {
      type: String,
      required: [true, 'O nível é obrigatório'],
      enum: Object.values(UserLevels),
      lowercase: true
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
    refreshToken: {
      type: String
    }
  },
  {
    discriminatorKey: 'level',
    timestamps: true
  }
)

UserSchema.pre('save', async function (this: HydratedDocument<IBaseUser>) {
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password!, salt)
})

UserSchema.pre('save', async function (this: HydratedDocument<IBaseUser>) {
  if (this.number) return

  const lastUser = await mongoose
    .model<IBaseUser>('User')
    .findOne({ level: this.level })
    .sort({ number: -1 })
    .select('number')

  this.number = lastUser?.number ? lastUser.number + 1 : 1
})

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password
    return ret
  }
})

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password!)
}

export type UserModel = mongoose.Model<IBaseUser, {}, IUserMethods>
export default mongoose.model<IBaseUser, UserModel>('User', UserSchema)
