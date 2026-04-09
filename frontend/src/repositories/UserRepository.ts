import { api } from '@/api/api'
import { Repository } from './Repository'

class UserRepository extends Repository {
  async getDoctor() {
    return this.handle(() => {
      return this.api.get(`${this.path}`)
    })
  }

  async getDetails({ userId }: { userId: string | undefined }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${userId}`)
    })
  }
}

export default new UserRepository({
  path: '/auth/users',
  api
})
