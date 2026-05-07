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

  async getAdmins({ unitId, search }: { unitId?: string; search?: string } = {}) {
    return this.handle(() => {
      return this.api.get(`${this.path}/admins`, {
        params: { unitId, search }
      })
    })
  }

  async createAdmin({ body }: { body: Record<string, unknown> }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/admins`, body)
    })
  }

  async editAdmin({
    adminId,
    body
  }: {
    adminId: string
    body: Record<string, unknown>
  }) {
    return this.handle(() => {
      return this.api.put(`${this.path}/admins/${adminId}`, body)
    })
  }
}

export default new UserRepository({
  path: '/auth/users',
  api
})
