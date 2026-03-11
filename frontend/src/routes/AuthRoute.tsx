import { Navigate } from 'react-router-dom'
import { routes } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: React.ReactNode
}

export default function AuthRoute({ children }: Props) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={routes.SIGNIN} />
  }

  return children
}
