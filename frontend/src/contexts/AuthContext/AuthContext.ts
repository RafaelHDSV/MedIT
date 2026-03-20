import type { IBaseUser } from '@/interfaces/IUser'
import type { LoginPayload } from '@/pages/SignIn/SignIn'
import { createContext } from 'react'

export interface AuthContextType {
  user: IBaseUser | null
  login: (payload: LoginPayload) => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
