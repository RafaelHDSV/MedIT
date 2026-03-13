import { api } from '@/api/api'
import { ROUTES } from '@/routes/constants'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const navigate = useNavigate()
  const name = 'rafael'
  const email = 'rafael@gmail.com'
  const password = '123456'

  function handleLogin() {
    navigate(ROUTES.SIGNIN.path)
  }

  const handleRegister = async () => {
    await api.post('/auth/register', {
      name,
      email,
      password
    })

    alert('Usuário criado')
  }

  return (
    <div>
      <h1>SignUp</h1>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  )
}

export default SignUp
