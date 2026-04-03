import { api } from '@/api/api'
import type { IError } from '@/interfaces/IError'
import { type IBaseUser } from '@/interfaces/IUser'
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
  const [user, setUser] = useState<IBaseUser | null>(() => {
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

      setUser(user)

      localStorage.setItem('user', JSON.stringify(user))
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
      title: 'Encerrar sessão',
      content: 'Você está prestes a sair da sua conta.',
      okText: 'Sair',
      cancelText: 'Cancelar',
      closable: true,
      mask: {
        closable: true
      },
      okButtonProps: {
        danger: true,
        autoFocus: true,
        size: 'middle'
      },
      cancelButtonProps: {
        size: 'middle'
      },

      async onOk() {
        modal.update({
          okButtonProps: {
            loading: true,
            danger: true
          }
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
          message.error('Erro ao encerrar sessão')
          modal.update({
            okButtonProps: {
              loading: false,
              danger: true
            }
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
