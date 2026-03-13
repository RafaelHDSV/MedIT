import UnauthImage from '@/assets/unauth-image.svg'
import { api } from '@/api/api'
import Logo from '@/layouts/components/Logo/Logo'
import { ROUTES } from '@/routes/constants'
import { Button, Flex, Form, Input, message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import styles from './SignUp.module.scss'
import { useForm } from 'antd/es/form/Form'
import { useAuth } from '@/hooks/useAuth'
import { Roles } from '@/interfaces/IUser'

function SignUp() {
  const { login } = useAuth()
  const [formRef] = useForm()
  const navigate = useNavigate()
  const name = Form.useWatch('name', formRef)
  const email = Form.useWatch('email', formRef)
  const password = Form.useWatch('password', formRef)

  const handleRegister = async () => {
    await api.post('/auth/register', {
      name,
      role: Roles.PACIENT,
      email,
      password
    })
    message.success('Usuário criado com sucesso!')

    setTimeout(() => {
      login(email, password)
      navigate(ROUTES.DASHBOARD.path)
    }, 1000)
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Form form={formRef} layout='vertical'>
          <Form.Item label='Nome' name='name'>
            <Input placeholder='Nome' type='text' />
          </Form.Item>
          <Form.Item label='Email' name='email'>
            <Input placeholder='Email' type='email' />
          </Form.Item>
          <Form.Item label='Senha' name='password'>
            <Input placeholder='Senha' type='password' />
          </Form.Item>

          <Flex gap={16}>
            <Button onClick={handleRegister}>Cadastrar</Button>
            <Link to={ROUTES.SIGNIN.path}>Já possui uma conta? Entrar</Link>
          </Flex>
        </Form>
      </aside>

      <aside className={styles.image}>
        <img src={UnauthImage} alt='Sign In' />
      </aside>
    </div>
  )
}

export default SignUp
