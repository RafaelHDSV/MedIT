import Button from '@/components/Button/Button'
import { FormItem } from '@/components/FormComponents/FormComponents'
import { ROUTES } from '@/routes/constants'
import validators from '@/utils/validators'
import { Flex, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../components/FormComponents/FormComponents.module.scss'
import { useAuth } from '../../hooks/useAuth'

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
    <Form
      form={formRef}
      className={styles.form}
      layout='vertical'
      onFinish={handleLogin}
    >
      <FormItem
        label='CPF ou Email'
        name='identifier'
        rules={[
          { required: true, message: 'Informe seu CPF ou email' },
          {
            validator(_, value) {
              if (!value) return Promise.resolve()
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
      </FormItem>
      <FormItem
        label='Senha'
        name='password'
        rules={[
          { required: true, message: 'Informe sua senha' },
          { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
        ]}
      >
        <Input.Password placeholder='Digite sua senha' />
      </FormItem>

      <Flex vertical className={styles.actions}>
        <Button htmlType='submit' loading={loading}>
          Entrar
        </Button>

        <Link className={styles.link} to={ROUTES.SIGNUP.path}>
          <p>Ainda não possui uma conta? Cadastrar-se</p>
        </Link>
      </Flex>
    </Form>
  )
}
