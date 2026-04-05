import AuthRepository from '@/repositories/AuthRepository'
import { Modal } from 'antd'
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        window.location.href = '/'
        return Promise.reject(error)
      }

      try {
        const { data } = await api.post('/auth/refresh', {
          refreshToken
        })

        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

        return api(originalRequest)
      } catch {
        const modal = Modal.warning({
          title: 'Sessão expirada',
          content:
            'Por favor, logue novamente para continuar utilizando o sistema',
          okText: 'Ok',
          closable: false,
          maskClosable: false,
          okButtonProps: {
            danger: true,
            autoFocus: true,
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
              await AuthRepository.logout({
                refreshToken
              })

              localStorage.removeItem('accessToken')
              localStorage.removeItem('refreshToken')
              localStorage.removeItem('user')
              window.location.href = '/'
            } catch (err) {
              console.error(err)
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
    }
  }
)
