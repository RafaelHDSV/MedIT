import { api } from '@/api/api'
import type { IError } from '@/interfaces/IError'
import { type IUser } from '@/interfaces/IUser'
import type { LoginPayload } from '@/pages/SignIn/SignIn'
import { message, Modal } from 'antd'
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

  async function login({
    email,
    cpf,
    password
  }: LoginPayload): Promise<boolean> {
    try {
      const response = await api.post('/auth/login', {
        email,
        cpf,
        password
      })

      const { accessToken, refreshToken, user } = response.data

      const formattedUser: IUser = {
        _id: user._id,
        name: user.name,
        cpf: user.cpf,
        role: user.role,
        email: user.email
      }

      setUser(formattedUser)

      localStorage.setItem('user', JSON.stringify(formattedUser))
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      return true
    } catch (err) {
      if (!axios.isAxiosError(err)) return false

      const error = err as AxiosError<IError>

      console.error('Erro no login', error)
      message.error(
        error.response?.data?.message || 'Email/CPF ou senha inválidos'
      )

      return false
    }
  }

  async function logout() {
    const modal = Modal.confirm({
      title: 'Sair da conta',
      content: 'Tem certeza que deseja encerrar sua sessão?',
      okText: 'Sair',
      cancelText: 'Cancelar',
      closable: true,
      destroyOnHidden: false,
      okButtonProps: { danger: true, autoFocus: true },

      async onOk() {
        modal.update({
          okButtonProps: { loading: true }
        })

        try {
          const refreshToken = localStorage.getItem('refreshToken')

          await api.post('/auth/logout', { refreshToken })

          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')

          setUser(null)
        } catch (err) {
          console.error('Erro no logout', err)
          message.error('Ocorreu um erro ao encerrar a sessão')
          modal.update({
            okButtonProps: { loading: false }
          })
        }
      }
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
