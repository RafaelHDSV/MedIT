import SignInImage from '@/assets/signin-image.svg'
import { Button, Flex, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import styles from './SignIn.module.scss'

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleLogin() {
    login('email@email.com', '123456')
    navigate(routes.DASHBOARD)
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <div className={styles.title}>
          <strong>Med</strong>
          <span>Flow</span>
        </div>

        <Input value='email@teste.com' />
        <Input value='senha' />

        <Flex gap={16}>
          <Button onClick={handleLogin}>Entrar</Button>
          <Link to={routes.SIGNUP}>
            Ainda não possui uma conta? Cadastrar-se
          </Link>
        </Flex>
      </aside>

      <aside className={styles.image}>
        <img src={SignInImage} alt='Sign In' />
      </aside>
    </div>
  )
}
