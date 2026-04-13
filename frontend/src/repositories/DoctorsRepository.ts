import { api } from '@/api/api'
import type { DoctorFormValues } from '@/interfaces/IDoctor'
import type { ObjectId } from 'mongoose'
import { Repository } from './Repository'

class DoctorsRepositoy extends Repository {
  async getDoctors({ unitId }: { unitId?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}`, {
        params: { unitId }
      })
    })
  }

  async createDoctor({ body }: { body: DoctorFormValues }) {
    return this.handle(() => {
      return this.api.post(`${this.path}`, body)
    })
  }

  async editDoctor({
    doctorId,
    body
  }: {
    doctorId: string | ObjectId | undefined
    body: DoctorFormValues
  }) {
    return this.handle(() => {
      return this.api.put(`${this.path}/${doctorId}`, body)
    })
  }

  async deleteDoctor({ doctorId }: { doctorId: ObjectId | undefined }) {
    return this.handle(() => {
      return this.api.delete(`${this.path}/${doctorId}`)
    })
  }

  async getAttendances({
    doctorId
  }: {
    doctorId: ObjectId | string | undefined
  }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${doctorId}/attendances`)
    })
  }
}

export default new DoctorsRepositoy({
  path: '/auth/doctors',
  api
})
