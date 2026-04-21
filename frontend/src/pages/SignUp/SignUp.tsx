import Button from '@/components/Button/Button'
import {
  FormItem,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import AuthRepository from '@/repositories/AuthRepository'
import PatientsRepository from '@/repositories/PatientsRepository'
import { ROUTES } from '@/routes/constants'
import validators from '@/utils/validators'
import { Flex, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../components/FormComponents/FormComponents.module.scss'

interface ISignUpFormErrors {
  name?: string
  cpf?: string
  email?: string
  password?: string
  unitId?: string
}

function SignUp() {
  const { login } = useAuth()
  const [formRef] = useForm()
  const navigate = useNavigate()
  const [fieldErrors, setFieldErrors] = useState<ISignUpFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [unitsLoading, setUnitsLoading] = useState(true)
  const [unitOptions, setUnitOptions] = useState<
    { label: string; value: string }[]
  >([])

  useEffect(() => {
    let cancelled = false

    async function loadUnits() {
      setUnitsLoading(true)
      try {
        const { data } = await AuthRepository.getSignupUnits()
        if (cancelled) return
        setUnitOptions(
          (data ?? []).map((u) => ({
            label: u.name,
            value: u._id
          }))
        )
      } catch {
        if (!cancelled) {
          setUnitOptions([])
        }
      } finally {
        if (!cancelled) setUnitsLoading(false)
      }
    }

    void loadUnits()
    return () => {
      cancelled = true
    }
  }, [])

  const handleRegister = async () => {
    setFieldErrors({})
    setLoading(true)

    try {
      const values = await formRef.validateFields()

      await PatientsRepository.createPatient({
        body: {
          ...values,
          cpf: values.cpf.replace(/\D/g, ''),
          unitId: values.unitId
        }
      })

      message.success('Usuário criado com sucesso!')

      await login({
        email: values.email,
        password: values.password
      })
      navigate(ROUTES.DASHBOARD.path)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao cadastrar usuário.',
        setFieldErrors
      })
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
        validateStatus={fieldErrors.cpf ? 'error' : ''}
        help={fieldErrors.cpf}
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
        label='Unidade de saúde'
        name='unitId'
        className={styles.input}
        validateStatus={fieldErrors.unitId ? 'error' : ''}
        help={fieldErrors.unitId}
        rules={[{ required: true, message: 'Selecione a unidade' }]}
      >
        <InputSelect
          placeholder={
            unitsLoading ? 'Carregando unidades...' : 'Selecione a unidade'
          }
          options={unitOptions}
          disabled={unitsLoading || unitOptions.length === 0}
        />
      </FormItem>

      <FormItem
        label='Email'
        name='email'
        className={styles.input}
        validateStatus={fieldErrors.email ? 'error' : ''}
        help={fieldErrors.email}
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
