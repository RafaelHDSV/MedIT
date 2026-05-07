import { api } from '@/api/api'
import { Repository } from './Repository'

class UserRepository extends Repository {
  async getDetails({ userId }: { userId: string | undefined }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${userId}`)
    })
  }

  async updateMe({ body }: { body: Record<string, unknown> }) {
    return this.handle(() => {
      return this.api.patch(`${this.path}/me`, body)
    })
  }
}

export default new UserRepository({
  path: '/auth/users',
  api
})
