import { Button, Flex, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleLogin() {
    login('email@email.com', '123456')
    navigate('/')
  }

  return (
    <div>
      <Typography.Title level={1}>Login</Typography.Title>

      <Flex gap={16}>
        <Button onClick={handleLogin}>Entrar</Button>
        <Link to='/signup'>Ainda não possui uma conta? Cadastrar-se</Link>
      </Flex>
    </div>
  )
}
