import UnauthImage from '@/assets/unauth-image.svg'
import Logo from '@/components/Logo/Logo'
import { ROUTES } from '@/routes/constants'
import validators from '@/utils/validators'
import { Button, Flex, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
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
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)

    try {
      const values = await formRef.validateFields()

      const identifier = values.identifier.trim()
      const password = values.password

      const payload: LoginPayload = { password }

      const cleanIdentifier = identifier.trim()
      if (validators(cleanIdentifier, 'email')) {
        payload.email = cleanIdentifier
      } else {
        payload.cpf = cleanIdentifier
      }

      const success = await login(payload)
      if (success) navigate(ROUTES.DASHBOARD.path)
    } catch (err) {
      console.error(err)
      message.error('Email/CPF ou senha inválidos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Form form={formRef} layout='vertical' onFinish={handleLogin}>
          <Form.Item
            label='CPF ou Email'
            name='identifier'
            rules={[
              { required: true, message: 'Informe seu CPF ou email' },
              {
                validator(_, value) {
                  const error = validators(value, 'signInIdentifier')
                  return error
                    ? Promise.resolve()
                    : Promise.reject(new Error('CPF ou email inválido'))
                }
              }
            ]}
          >
            <Input
              placeholder='Digite seu CPF ou email'
              maxLength={
                validators(formRef.getFieldValue('identifier'), 'validCpf')
                  ? 14
                  : 200
              }
            />
          </Form.Item>
          <Form.Item
            label='Senha'
            name='password'
            rules={[
              { required: true, message: 'Informe sua senha' },
              { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
            ]}
          >
            <Input.Password placeholder='Digite sua senha' />
          </Form.Item>

          <Flex gap={16}>
            <Button type='primary' loading={loading} htmlType='submit'>
              Entrar
            </Button>
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
