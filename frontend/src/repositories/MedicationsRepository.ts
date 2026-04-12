import { api } from '@/api/api'
import { Repository } from './Repository'

class MedicationsRepository extends Repository {
  async getMedications({ unitId }: { unitId?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/unit/${unitId}`)
    })
  }
}

export default new MedicationsRepository({
  path: '/auth/medications',
  api
})
