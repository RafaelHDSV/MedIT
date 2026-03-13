import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { type IUser } from '@/interfaces/IUser'
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
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })
      const { token, user } = response.data

      const formattedUser: IUser = {
        _id: user._id,
        name: user.name,
        role: user.role,
        email: user.email,
        password: user.password
      }

      setUser(formattedUser)
      localStorage.setItem('user', JSON.stringify(formattedUser))
      localStorage.setItem('token', token)
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
