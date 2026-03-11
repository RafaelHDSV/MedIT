import { useNavigate } from 'react-router-dom'
import { routes } from '../../constants/routes'

function SignUp() {
  const navigate = useNavigate()

  function handleLogin() {
    navigate(routes.SIGNIN)
  }

  return (
    <div>
      <h1>SignUp</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default SignUp
