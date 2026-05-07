import { api } from '@/api/api'
import { Repository } from './Repository'

class UnitsRepository extends Repository {
  async getUnits({ activeUnitId }: { activeUnitId?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}`, { params: { activeUnitId } })
    })
  }

  async getAllUnits({ search }: { search?: string } = {}) {
    return this.handle(() => {
      return this.api.get(`${this.path}/all`, { params: { search } })
    })
  }

  async getUnit({ id }: { id?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${id}`)
    })
  }

  async editUnit({ id, body }: { id: string; body: Record<string, unknown> }) {
    return this.handle(() => {
      return this.api.put(`${this.path}/${id}`, body)
    })
  }
}

export default new UnitsRepository({
  path: '/auth/units',
  api
})
