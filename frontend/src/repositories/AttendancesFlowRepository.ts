import { api } from '@/api/api'
import type {
  IAttendanceDetails,
  IPrescribedMedication,
  PatientDisposition
} from '@/interfaces/IAttendance'
import type {
  ISuggestedDiseasesPayload,
  ISuggestionDetails
} from '@/interfaces/ISymptomDiseases'
import { Repository } from './Repository'

class AttendancesFlowRepository extends Repository {
  async getAttendanceDetails({ attendanceId }: { attendanceId: string }) {
    return this.handle(() => {
      return this.api.get<{ data: IAttendanceDetails }>(
        `${this.path}/${attendanceId}`
      )
    })
  }

  async getSuggestedDiseases({ attendanceId }: { attendanceId: string }) {
    return this.handle(() => {
      return this.api.get<{ data: ISuggestedDiseasesPayload }>(
        `${this.path}/${attendanceId}/suggested-diseases`
      )
    })
  }

  async getSuggestionDetail({
    attendanceId,
    disease
  }: {
    attendanceId: string
    disease: string
  }) {
    return this.handle(() =>
      this.api.get<{ data: ISuggestionDetails }>(
        `${this.path}/${attendanceId}/suggestion-detail`,
        { params: { disease } }
      )
    )
  }

  async claimTriage({ attendanceId }: { attendanceId: string }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/${attendanceId}/claim-triage`)
    })
  }

  async completeTriage({ attendanceId }: { attendanceId: string }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/${attendanceId}/complete-triage`)
    })
  }

  async completeAttendance({
    attendanceId,
    diagnosisKey,
    diagnosisText,
    patientDisposition,
    prescribedMedications,
    prescribedExams
  }: {
    attendanceId: string
    diagnosisKey: string
    diagnosisText?: string
    patientDisposition?: PatientDisposition
    prescribedMedications?: IPrescribedMedication[]
    prescribedExams?: string[]
  }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/${attendanceId}/complete-attendance`, {
        diagnosisKey,
        diagnosisText,
        patientDisposition,
        prescribedMedications,
        prescribedExams
      })
    })
  }

  async claimConsultation({ attendanceId }: { attendanceId: string }) {
    return this.handle(() => {
      return this.api.post(`${this.path}/${attendanceId}/claim-consultation`)
    })
  }
}

export default new AttendancesFlowRepository({
  path: '/auth/attendances',
  api
})
