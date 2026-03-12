import { ROUTES } from '@/routes/constants'
import { useNavigate } from 'react-router-dom'

function SignUp() {
  const navigate = useNavigate()

  function handleLogin() {
    navigate(ROUTES.SIGNIN.path)
  }

  return (
    <div>
      <h1>SignUp</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default SignUp
