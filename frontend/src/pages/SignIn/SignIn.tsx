import UnauthImage from '@/assets/unauth-image.svg'
import { Button, Flex, Form, Input } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './SignIn.module.scss'
import Logo from '@/layouts/components/Logo/Logo'
import { ROUTES } from '@/routes/constants'
import { useForm } from 'antd/es/form/Form'

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formRef] = useForm()
  const email = Form.useWatch('email', formRef)
  const password = Form.useWatch('password', formRef)

  async function handleLogin() {
    await login(email, password)
    navigate(ROUTES.DASHBOARD.path)
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Form form={formRef} layout='vertical'>
          <Form.Item label='Email' name='email'>
            <Input placeholder='Email' type='email' />
          </Form.Item>
          <Form.Item label='Senha' name='password'>
            <Input placeholder='Senha' type='password' />
          </Form.Item>

          <Flex gap={16}>
            <Button onClick={handleLogin}>Entrar</Button>
            <Link to={ROUTES.SIGNUP.path}>
              Ainda não possui uma conta? Cadastrar-se
            </Link>
          </Flex>
        </Form>
      </aside>

      <aside className={styles.image}>
        <img src={UnauthImage} alt='Sign In' />
      </aside>
    </div>
  )
}
