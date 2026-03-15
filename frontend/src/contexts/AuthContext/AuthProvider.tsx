import { api } from '@/api/api'
import type { IError } from '@/interfaces/IError'
import { type IUser } from '@/interfaces/IUser'
import type { LoginPayload } from '@/pages/SignIn/SignIn'
import { message } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<IUser | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  async function login({ email, cpf, password }: LoginPayload) {
    try {
      const response = await api.post('/auth/login', {
        email,
        cpf,
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
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.log(error)

      console.error('Erro no login', error)
      message.error(
        error.response?.data?.message || 'Email/CPF ou senha inválidos'
      )
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
