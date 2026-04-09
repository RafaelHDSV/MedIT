import { api } from '@/api/api'
import { Repository } from './Repository'

class UnitsRepository extends Repository {
  async getUnits() {
    return this.handle(() => {
      return this.api.get(`${this.path}`)
    })
  }
}

export default new UnitsRepository({
  path: '/auth/units',
  api
})
