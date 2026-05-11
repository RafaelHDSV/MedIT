import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import Medications from '@/pages/Medications/Medications'
import { Navigate } from 'react-router-dom'
import { ROUTES } from './constants'

export default function MedicationsPageGate() {
  const { user } = useAuth()

  if (user?.level === UserLevels.MEDIT) {
    return <Navigate to={ROUTES.DASHBOARD.path} replace />
  }

  return <Medications />
}
