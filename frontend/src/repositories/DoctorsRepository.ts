import { api } from '@/api/api'
import type { ObjectId } from 'mongoose'
import { Repository } from './Repository'

class DoctorsRepositoy extends Repository {
  async getDoctor() {
    return this.handle(() => {
      return this.api.get(`${this.path}`)
    })
  }

  async getAttendances({ doctorId }: { doctorId: ObjectId | undefined }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${doctorId}/attendances`)
    })
  }
}

export default new DoctorsRepositoy({
  path: '/auth/doctors',
  api
})
