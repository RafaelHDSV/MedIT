import UnauthImage from '@/assets/unauth-image.svg'
import Logo from '@/components/Logo/Logo'
import { ROUTES } from '@/routes/constants'
import masks from '@/utils/masks'
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
  const [inputType, setInputType] = useState<'cpf' | 'email' | undefined>()
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)

    try {
      const values = await formRef.validateFields()

      const identifier = values.identifier.trim()
      const password = values.password

      const payload: LoginPayload = { password }

      if (validators(identifier, 'email')) {
        payload.email = identifier
      } else {
        payload.cpf = identifier.replace(/\D/g, '')
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

  function handleIdentifierChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (
      validators(value.replace(/\D/g, ''), 'onlyNumbers') &&
      value.replace(/\D/g, '').length <= 11
    ) {
      setInputType('cpf')
      formRef.setFieldsValue({ identifier: masks(value, 'cpf') })
    } else {
      setInputType('email')
      formRef.setFieldsValue({ identifier: value })
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
            normalize={(value) => {
              const numbers = value.replace(/\D/g, '')

              if (numbers.length <= 11) {
                return masks(numbers, 'cpf')
              }

              return value
            }}
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
              onChange={handleIdentifierChange}
              maxLength={inputType === 'cpf' ? 14 : 100}
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
