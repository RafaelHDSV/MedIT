import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from './constants'

interface Props {
  children: React.ReactNode
}

export default function UnauthRoute({ children }: Props) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD.path} />
  }

  return children
}
