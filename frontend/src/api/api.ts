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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')

      try {
        const { data } = await api.post('/auth/refresh', {
          refreshToken
        })

        localStorage.setItem('accessToken', data.accessToken)

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`

        return api(originalRequest)
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/signin'
      }
    }

    return Promise.reject(error)
  }
)