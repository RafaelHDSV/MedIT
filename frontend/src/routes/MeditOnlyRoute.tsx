import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import { Navigate } from 'react-router-dom'
import { ROUTES } from './constants'

interface Props {
  children: React.ReactNode
}

export default function MeditOnlyRoute({ children }: Props) {
  const { user } = useAuth()

  if (user?.level !== UserLevels.MEDIT) {
    return <Navigate to={ROUTES.DASHBOARD.path} replace />
  }

  return children
}
