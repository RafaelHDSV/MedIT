import { IBaseUser } from './IUser.js'

export interface INurse extends IBaseUser {
  coren: string
  shift: string
}
