import type { IAuthUser } from '@/interfaces/IUser'
import type { LoginPayload } from '@/pages/SignIn/SignIn'
import { createContext } from 'react'

export interface AuthContextType {
  user: IAuthUser | null
  login: (payload: LoginPayload) => void
  logout: (options?: { skipConfirm?: boolean }) => Promise<void>
  updateUser: (patch: Partial<IAuthUser>) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
