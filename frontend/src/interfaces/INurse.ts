import type { IBaseUser } from './IUser'

export interface INurse extends IBaseUser {
  coren: string
  shift: string
}
