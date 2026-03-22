import { api } from '@/api/api'
import Button from '@/components/Button/Button'
import { FormItem } from '@/components/FormComponents/FormComponents'
import InputText from '@/components/InputText/InputText'
import { useAuth } from '@/hooks/useAuth'
import type { IError } from '@/interfaces/IError'
import { UserLevels } from '@/interfaces/IUser'
import { ROUTES } from '@/routes/constants'
import validators from '@/utils/validators'
import { Flex, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../styles/Form.module.scss'

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
        cpf: values.cpf.replace(/\D/g, ''),
        level: UserLevels.PATIENT
      })

      message.success('Usuário criado com sucesso!')

      const success = await login({
        email: values.email,
        password: values.password
      })

      if (success) navigate(ROUTES.DASHBOARD.path)
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
    <Form
      form={formRef}
      className={styles.form}
      layout='vertical'
      onFinish={handleRegister}
    >
      <FormItem
        label='Nome'
        name='name'
        className={styles.input}
        validateStatus={fieldErrors.name ? 'error' : ''}
        help={fieldErrors.name}
        rules={[{ required: true, message: 'Campo obrigatório' }]}
      >
        <Input placeholder='Digite seu nome' type='text' />
      </FormItem>

      <FormItem
        label='CPF'
        name='cpf'
        className={styles.input}
        rules={[
          { required: true, message: 'Informe seu CPF' },
          {
            validator(_, value) {
              if (!value) return Promise.resolve()
              const error = validators(value, 'validCpf')
              return error
                ? Promise.resolve()
                : Promise.reject(new Error('CPF inválido'))
            }
          }
        ]}
      >
        <InputText mask='cpf' placeholder='Digite seu CPF' />
      </FormItem>

      <FormItem
        label='Email'
        name='email'
        className={styles.input}
        rules={[
          { required: true, message: 'Informe seu email' },
          {
            validator(_, value) {
              if (!value) return Promise.resolve()
              const error = validators(value, 'email')
              return error
                ? Promise.resolve()
                : Promise.reject(new Error('Email inválido'))
            }
          }
        ]}
      >
        <Input placeholder='Digite seu email' type='email' />
      </FormItem>

      <FormItem
        label='Senha'
        name='password'
        className={styles.input}
        validateStatus={fieldErrors.password ? 'error' : ''}
        help={fieldErrors.password}
        rules={[
          { required: true, message: 'Campo obrigatório' },
          { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
        ]}
      >
        <Input.Password placeholder='Digite sua senha' />
      </FormItem>

      <Flex vertical className={styles.actions}>
        <Button htmlType='submit' loading={loading}>
          Cadastrar
        </Button>

        <Link className={styles.link} to={ROUTES.SIGNIN.path}>
          <p>Já possui uma conta? Entrar</p>
        </Link>
      </Flex>
    </Form>
  )
}

export default SignUp
