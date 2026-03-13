import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { Roles, type IUser } from '@/interfaces/IUser'
import { api } from '@/api/api'

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<IUser | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  async function login(email: string, password: string) {
    const fakeUser = {
      id: '1',
      shortName: 'Rafael Vieira',
      name: 'Rafael Henrique de Sousa Vieira',
      role: Roles.ADMIN,
      email,
      password
    }
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      const { token, user } = response.data

      setUser(user ?? fakeUser)
      localStorage.setItem('user', JSON.stringify(user ?? fakeUser))
      localStorage.setItem('token', token ?? 'fakeToken')
    } catch (error) {
      console.error('Erro no login', error)
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
