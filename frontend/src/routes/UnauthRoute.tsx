import { Navigate } from 'react-router-dom'
import { routes } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: React.ReactNode
}

export default function UnauthRoute({ children }: Props) {
  const { user } = useAuth()

  if (user) {
    return <Navigate to={routes.DASHBOARD} />
  }

  return children
}
