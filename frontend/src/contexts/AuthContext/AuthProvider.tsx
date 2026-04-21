import { type IAuthUser } from '@/interfaces/IUser'
import type { LoginPayload } from '@/pages/SignIn/SignIn'
import AuthRepository from '@/repositories/AuthRepository'
import { message, Modal } from 'antd'
import { useState, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<IAuthUser | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  async function login({ email, cpf, password }: LoginPayload) {
    const response = await AuthRepository.login({
      body: {
        email,
        cpf,
        password
      }
    })

    const { accessToken, refreshToken, user } = response.data

    setUser(user)

    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    return true
  }

  function clearLocalSession() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setUser(null)
  }

  async function finalizeLogout(options?: { silentApiError?: boolean }) {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      await AuthRepository.logout({ refreshToken })
      clearLocalSession()
    } catch (err) {
      console.error('Erro no logout', err)
      if (options?.silentApiError) {
        clearLocalSession()
      } else {
        message.error('Erro ao encerrar sessão')
      }
    }
  }

  async function logout(options?: { skipConfirm?: boolean }) {
    if (options?.skipConfirm) {
      await finalizeLogout({ silentApiError: true })
      return
    }

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
          await finalizeLogout()
        } finally {
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
