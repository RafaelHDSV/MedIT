import { UserLevels } from '@/interfaces/IUser'

const MedicationModel = {
  canAddMedication: (userLevel?: UserLevels) => {
    if (!userLevel) return false
    const invalidLevels: UserLevels[] = [UserLevels.PATIENT, UserLevels.MEDIT]
    return !invalidLevels.includes(userLevel as UserLevels)
  },

  canSeeUnits: (userLevel?: UserLevels) => {
    if (!userLevel) return false
    const invalidLevels: UserLevels[] = [UserLevels.PATIENT, UserLevels.MEDIT]
    return !invalidLevels.includes(userLevel as UserLevels)
  },

  canEditMedication: (userLevel?: UserLevels) => {
    if (!userLevel) return false
    const invalidLevels: UserLevels[] = [UserLevels.PATIENT, UserLevels.MEDIT]
    return !invalidLevels.includes(userLevel as UserLevels)
  }
}

export default MedicationModel
