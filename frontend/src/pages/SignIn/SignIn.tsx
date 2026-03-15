import UnauthImage from '@/assets/unauth-image.svg'
import Logo from '@/components/Logo/Logo'
import { ROUTES } from '@/routes/constants'
import validators from '@/utils/validators'
import { Button, Flex, Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './SignIn.module.scss'

export interface LoginPayload {
  email?: string
  cpf?: string
  password: string
}

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [formRef] = useForm()
  const identifier = Form.useWatch('identifier', formRef)
  const password = Form.useWatch('password', formRef)

  async function handleLogin() {
    const loginPayload: LoginPayload = {
      password
    }
    if (identifier) {
      const isEmail = validators(identifier, 'email')
      if (isEmail) {
        loginPayload.email = identifier
      } else {
        loginPayload.cpf = identifier
      }
    }

    await login(loginPayload)
    navigate(ROUTES.DASHBOARD.path)
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Form form={formRef} layout='vertical'>
          <Form.Item label='CPF ou Email' name='identifier'>
            <Input placeholder='Digite seu CPF ou email' />
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
