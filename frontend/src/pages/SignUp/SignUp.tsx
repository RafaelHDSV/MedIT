import { api } from '@/api/api'
import UnauthImage from '@/assets/unauth-image.svg'
import InputText from '@/components/InputText/InputText'
import Logo from '@/components/Logo/Logo'
import { useAuth } from '@/hooks/useAuth'
import type { IError } from '@/interfaces/IError'
import { Roles } from '@/interfaces/IUser'
import { ROUTES } from '@/routes/constants'
import validators from '@/utils/validators'
import { Button, Flex, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './SignUp.module.scss'

interface ISignUpFormErrors {
  name?: string
  cpf?: string
  email?: string
  password?: string
}

function SignUp() {
  const { login } = useAuth()
  const [formRef] = useForm()
  const navigate = useNavigate()
  const [fieldErrors, setFieldErrors] = useState<ISignUpFormErrors>({})
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setFieldErrors({})
    setLoading(true)

    try {
      const values = await formRef.validateFields()

      await api.post('/auth/register', {
        ...values,
        role: Roles.PATIENT
      })

      message.success('Usuário criado com sucesso!')

      await login({
        email: values.email,
        cpf: values.cpf,
        password: values.password
      })

      navigate(ROUTES.DASHBOARD.path)
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>

      if (error.response?.data?.errors) {
        const formatted: Record<string, string> = {}

        Object.entries(error.response.data.errors).forEach(([key, val]) => {
          formatted[key] = val.message
        })

        setFieldErrors(formatted)
        message.error('Corrija os campos destacados.')
      } else {
        message.error(
          error.response?.data?.message ?? 'Erro ao cadastrar usuário.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Form form={formRef} layout='vertical' onFinish={handleRegister}>
          <Form.Item
            label='Nome'
            name='name'
            validateStatus={fieldErrors.name ? 'error' : ''}
            help={fieldErrors.name}
            rules={[{ required: true, message: 'Campo obrigatório' }]}
          >
            <Input placeholder='Digite seu nome' type='text' />
          </Form.Item>

          <Form.Item
            label='CPF'
            name='cpf'
            rules={[
              { required: true, message: 'Informe seu CPF' },
              {
                validator(_, value) {
                  const error = validators(value, 'validCpf')
                  return error
                    ? Promise.resolve()
                    : Promise.reject(new Error('CPF inválido'))
                }
              }
            ]}
          >
            <InputText mask='cpf' placeholder='Digite seu CPF' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Informe seu email' },
              {
                validator(_, value) {
                  const error = validators(value, 'email')
                  return error
                    ? Promise.resolve()
                    : Promise.reject(new Error('Email inválido'))
                }
              }
            ]}
          >
            <Input placeholder='Digite seu email' type='email' />
          </Form.Item>

          <Form.Item
            label='Senha'
            name='password'
            validateStatus={fieldErrors.password ? 'error' : ''}
            help={fieldErrors.password}
            rules={[
              { required: true, message: 'Campo obrigatório' },
              { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
            ]}
          >
            <Input.Password placeholder='Digite sua senha' />
          </Form.Item>

          <Flex gap={16}>
            <Button type='primary' loading={loading} htmlType='submit'>
              Cadastrar
            </Button>
            <Link to={ROUTES.SIGNIN.path}>Já possui uma conta? Entrar</Link>
          </Flex>
        </Form>
      </aside>

      <aside className={styles.image}>
        <img src={UnauthImage} alt='Sign Up' />
      </aside>
    </div>
  )
}

export default SignUp
