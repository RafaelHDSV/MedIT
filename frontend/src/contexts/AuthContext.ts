import { createContext } from 'react'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
