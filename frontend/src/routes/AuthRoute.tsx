import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from './constants'

interface Props {
  children: React.ReactNode
}

export default function AuthRoute({ children }: Props) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to={ROUTES.SIGNIN.path} />
  }

  return children
}
