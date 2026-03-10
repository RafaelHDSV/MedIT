import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
  children: React.ReactNode
}

export default function AuthRoute({ children }: Props) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to='/login' />
  }

  return children
}
