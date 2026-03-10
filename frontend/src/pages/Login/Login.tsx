import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleLogin() {
    login('email@email.com', '123456')
    navigate('/')
  }

  function handleSignIn() {
    navigate('/signup')
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Entrar</button>
      <button onClick={handleSignIn}>Criar conta</button>
    </div>
  )
}
