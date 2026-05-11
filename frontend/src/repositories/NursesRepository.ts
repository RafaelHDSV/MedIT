import { api } from '@/api/api'
import type { NurseFormValues } from '@/interfaces/INurse'
import type { ObjectId } from 'mongoose'
import { Repository } from './Repository'

class NursesRepositoy extends Repository {
  async getNurses({ unitId }: { unitId?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}`, {
        params: unitId ? { unitId } : {}
      })
    })
  }

  async createNurse({ body }: { body: NurseFormValues }) {
    return this.handle(() => {
      return this.api.post(`${this.path}`, body)
    })
  }

  async editNurse({
    nurseId,
    body
  }: {
    nurseId: string | ObjectId | undefined
    body: NurseFormValues
  }) {
    return this.handle(() => {
      return this.api.put(`${this.path}/${nurseId}`, body)
    })
  }

  async deleteNurse({ nurseId }: { nurseId: ObjectId | undefined }) {
    return this.handle(() => {
      return this.api.delete(`${this.path}/${nurseId}`)
    })
  }

  async getAttendances({
    nurseId,
    completedTriage
  }: {
    nurseId: ObjectId | string | undefined
    completedTriage?: boolean
  }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${nurseId}/attendances`, {
        params: { completedTriage }
      })
    })
  }
}

export default new NursesRepositoy({
  path: '/auth/nurses',
  api
})
