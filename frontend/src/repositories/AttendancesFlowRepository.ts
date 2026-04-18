import { api } from '@/api/api'
import { Repository } from './Repository'

class AttendancesFlowRepository extends Repository {
  async claimTriage({ attendanceId }: { attendanceId: string }) {
    return this.handle(() =>
      this.api.post(`${this.path}/${attendanceId}/claim-triage`)
    )
  }

  async completeTriage({ attendanceId }: { attendanceId: string }) {
    return this.handle(() =>
      this.api.post(`${this.path}/${attendanceId}/complete-triage`)
    )
  }

  async claimConsultation({ attendanceId }: { attendanceId: string }) {
    return this.handle(() =>
      this.api.post(`${this.path}/${attendanceId}/claim-consultation`)
    )
  }
}

export default new AttendancesFlowRepository({
  path: '/auth/attendances',
  api
})
