import type { IUser } from '@/interfaces/IUser'
import { createContext } from 'react'

export interface AuthContextType {
  user: IUser | null
  login: (email: string, password: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
