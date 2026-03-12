import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { Roles, type IUser } from '@/interfaces/IUser'

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<IUser | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  function login(email: string, password: string) {
    const fakeUser = {
      id: '1',
      shortName: 'Rafael Vieira',
      name: 'Rafael Henrique de Sousa Vieira',
      role: Roles.ADMIN,
      email,
      password
    }

    setUser(fakeUser)
    localStorage.setItem('user', JSON.stringify(fakeUser))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
