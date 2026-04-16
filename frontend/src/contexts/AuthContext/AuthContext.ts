import type { IDoctor } from '@/interfaces/IDoctor'
import type { INurse } from '@/interfaces/INurse'
import type { IPatient } from '@/interfaces/IPatient'
import type { IBaseUser } from '@/interfaces/IUser'
import type { LoginPayload } from '@/pages/SignIn/SignIn'
import { createContext } from 'react'

type IAuthUser = IBaseUser & IDoctor & INurse & IPatient

export interface AuthContextType {
  user: IAuthUser | null
  login: (payload: LoginPayload) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
