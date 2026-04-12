import { api } from '@/api/api'
import { Repository } from './Repository'

class UnitsRepository extends Repository {
  async getUnits({ activeUnitId }: { activeUnitId?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}`, { params: { activeUnitId } })
    })
  }

  async getUnit({ id }: { id?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${id}`)
    })
  }
}

export default new UnitsRepository({
  path: '/auth/units',
  api
})
