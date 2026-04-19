import { api } from '@/api/api'
import type { Periods } from '@/interfaces/globals'
import type { UserLevels } from '@/interfaces/IUser'
import type { ObjectId } from 'mongoose'
import { Repository } from './Repository'

class AuthRepository extends Repository {
  async getStatusCards({
    params
  }: {
    params: {
      userId: ObjectId | string | undefined
      unitId: ObjectId | string | undefined
      level: UserLevels | undefined
      period: Periods
      referenceDate?: string
    }
  }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/status-cards`, {
        params
      })
    })
  }

  async getAttendanceByTime({
    params
  }: {
    params: {
      unitId: ObjectId | string | undefined
      period: Periods
      referenceDate?: string
    }
  }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/attendance-by-time`, {
        params
      })
    })
  }

  async getAttendanceQueue({
    params
  }: {
    params: {
      unitId: ObjectId | string | undefined
      level?: UserLevels
    }
  }) {
    return this.handle(() => {
      return this.api.get(`${this.path}/attendance-queue`, {
        params
      })
    })
  }
}

export default new AuthRepository({
  path: '/auth/dashboard',
  api
})
