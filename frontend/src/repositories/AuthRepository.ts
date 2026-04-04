import { api } from '@/api/api'
import { Repository } from './Repository'

class AuthRepository extends Repository {
  async login({
    body
  }: {
    body: {
      email: string | undefined
      cpf: string | undefined
      password: string
    }
  }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/login`, body)
    })
  }

  async logout({ refreshToken }: { refreshToken: string | null }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/logout`, { refreshToken })
    })
  }
}

export default new AuthRepository({
  path: '/auth',
  api
})
