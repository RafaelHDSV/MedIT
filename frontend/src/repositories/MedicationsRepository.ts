import { api } from '@/api/api'
import type { MedicationFormValues } from '@/interfaces/IMedication'
import { Repository } from './Repository'

class MedicationsRepository extends Repository {
  async getMedications({ unitId }: { unitId?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/unit/${unitId}`)
    })
  }

  async createMedication({ body }: { body: MedicationFormValues }) {
    return this.handle(() => {
      return this.api.post(`${this.path}`, body)
    })
  }

  async editMedication({
    medicationId,
    body
  }: {
    medicationId: string
    body: MedicationFormValues
  }) {
    return this.handle(() => {
      return this.api.put(`${this.path}/${medicationId}`, body)
    })
  }
}

export default new MedicationsRepository({
  path: '/auth/medications',
  api
})
