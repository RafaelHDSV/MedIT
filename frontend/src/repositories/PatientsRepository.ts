import { api } from '@/api/api'
import type { PatientFormValues, PatientSignupBody } from '@/interfaces/IPatient'
import type { PreRegistrationFormValues } from '@/pages/PreRegistration/IPreRegistration'
import type { ObjectId } from 'mongoose'
import { Repository } from './Repository'

class PatientsRepositoy extends Repository {
  async getPatients({ unitId }: { unitId?: string }) {
    return this.handle(() => {
      return this.api.get(`${this.path}`, {
        params: { unitId }
      })
    })
  }

  async createPatient({ body }: { body: PatientSignupBody }) {
    return this.handle(() => {
      return this.api.post(`${this.path}`, body)
    })
  }

  async editPatient({
    patientId,
    body
  }: {
    patientId: string | ObjectId | undefined
    body: PatientFormValues
  }) {
    return this.handle(() => {
      return this.api.put(`${this.path}/${patientId}`, body)
    })
  }

  async deletePatient({ patientId }: { patientId: ObjectId | undefined }) {
    return this.handle(() => {
      return this.api.delete(`${this.path}/${patientId}`)
    })
  }

  async getAttendances({
    patientId
  }: {
    patientId: ObjectId | string | undefined
  }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/${patientId}/attendances`)
    })
  }

  async createPatientAttendance({ body }: { body: PreRegistrationFormValues }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/attendances`, body)
    })
  }

  async confirmPatientArrival({ attendanceId }: { attendanceId: string }) {
    return this.handle(() =>
      this.api.post(
        `${this.path}/attendances/${attendanceId}/confirm-arrival`
      )
    )
  }
}

export default new PatientsRepositoy({
  path: '/auth/patients',
  api
})
