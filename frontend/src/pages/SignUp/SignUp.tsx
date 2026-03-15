import { api } from '@/api/api'
import UnauthImage from '@/assets/unauth-image.svg'
import Logo from '@/components/Logo/Logo'
import { useAuth } from '@/hooks/useAuth'
import { Roles } from '@/interfaces/IUser'
import { ROUTES } from '@/routes/constants'
import { Button, Flex, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { Link, useNavigate } from 'react-router-dom'
import styles from './SignUp.module.scss'

import InputText from '@/components/InputText/InputText'
import type { IError } from '@/interfaces/IError'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useState } from 'react'

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
  const name = Form.useWatch('name', formRef)
  const cpf = Form.useWatch('cpf', formRef)
  const email = Form.useWatch('email', formRef)
  const password = Form.useWatch('password', formRef)

  const handleRegister = async () => {
    setFieldErrors({})
    try {
      await api.post('/auth/register', {
        name,
        cpf,
        role: Roles.PATIENT,
        email,
        password
      })
      message.success('Usuário criado com sucesso!')
      setTimeout(() => {
        login(email, password)
        navigate(ROUTES.DASHBOARD.path)
      }, 1000)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const error = err as AxiosError<IError>

        if (error.response?.data?.errors) {
          const errors = error.response.data.errors
          const formatted: { [key: string]: string } = {}

          Object.keys(errors).forEach((key) => {
            formatted[key] = errors[key].message
          })

          setFieldErrors(formatted)
          message.error('Por favor, corrija os campos destacados.')
        } else if (error.response?.data?.message) {
          message.error(error.response.data.message)
        } else {
          message.error('Erro ao cadastrar usuário.')
        }
      } else {
        message.error('Erro ao cadastrar usuário.')
      }
    }
  }

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Form form={formRef} layout='vertical'>
          <Form.Item
            label='Nome'
            name='name'
            validateStatus={fieldErrors.name ? 'error' : ''}
            help={fieldErrors.name}
          >
            <Input placeholder='Nome' type='text' />
          </Form.Item>

          <Form.Item
            label='CPF'
            name='cpf'
            validateStatus={fieldErrors.cpf ? 'error' : ''}
            help={fieldErrors.cpf}
          >
            <InputText mask='cpf' placeholder='CPF' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            validateStatus={fieldErrors.email ? 'error' : ''}
            help={fieldErrors.email}
          >
            <Input placeholder='Email' type='email' />
          </Form.Item>

          <Form.Item
            label='Senha'
            name='password'
            validateStatus={fieldErrors.password ? 'error' : ''}
            help={fieldErrors.password}
          >
            <Input placeholder='Senha' type='password' minLength={6} />
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
