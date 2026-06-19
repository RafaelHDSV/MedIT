import { UserLevels } from '@/interfaces/IUser'

const BLOCKED_LEVELS: UserLevels[] = [UserLevels.PATIENT, UserLevels.MEDIT]

function canManageMedicationByLevel(userLevel?: UserLevels) {
  if (!userLevel) return false
  return !BLOCKED_LEVELS.includes(userLevel as UserLevels)
}

function canManageMedicationInUnit(
  userLevel?: UserLevels,
  userUnitId?: string,
  targetUnitId?: string
) {
  if (!canManageMedicationByLevel(userLevel)) return false
  if (!userUnitId || !targetUnitId) return false
  return String(userUnitId) === String(targetUnitId)
}

const MedicationModel = {
  canAddMedication: (
    userLevel?: UserLevels,
    userUnitId?: string,
    targetUnitId?: string
  ) => canManageMedicationInUnit(userLevel, userUnitId, targetUnitId),

  canSeeUnits: (userLevel?: UserLevels) => canManageMedicationByLevel(userLevel),

  canEditMedication: (
    userLevel?: UserLevels,
    userUnitId?: string,
    targetUnitId?: string
  ) => canManageMedicationInUnit(userLevel, userUnitId, targetUnitId)
}

export default MedicationModel
