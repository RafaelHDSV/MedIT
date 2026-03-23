import { api } from '@/api/api'
import Button from '@/components/Button/Button'
import {
  FormItem,
  InputDate,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import {
  DoctorSpecializations,
  DoctorSpecializationsLabels,
  type DoctorFormValues,
  type IDoctor
} from '@/interfaces/IDoctor'
import type { IError } from '@/interfaces/IError'
import { UserGendersLabels } from '@/interfaces/IUser'
import masks from '@/utils/masks'
import validators, { birthDateValidator } from '@/utils/validators'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import formStyles from '../../../../components/FormComponents/FormComponents.module.scss'
import styles from './DoctorModal.module.scss'

interface IDoctorModalProps {
  doctor?: IDoctor | null
  buttonText?: string
  fetchDoctors?: () => void
  fetchDoctorDetails?: () => void
}

function DoctorModal({
  doctor,
  buttonText,
  fetchDoctors,
  fetchDoctorDetails
}: IDoctorModalProps) {
  const [form] = useForm()
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isEditMode = Boolean(doctor)

  const handleOpen = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const inputHeight = '2.5rem'

  const specialization = Form.useWatch('specialization', form)
  const isOtherSpecialization =
    specialization && specialization === DoctorSpecializations.OTHER

  async function onFinish(values: DoctorFormValues) {
    try {
      setLoading(true)

      if (isEditMode) {
        await api.put(`/doctors/${params.id}`, {
          ...values,
          crm: masks(values.crm, 'crm')
        })
        message.success('Médico atualizado com sucesso')
        fetchDoctorDetails?.()
      } else {
        await api.post('/doctors', { ...values, crm: masks(values.crm, 'crm') })
        message.success('Médico adicionado com sucesso')
        handleClose()
        fetchDoctors?.()
      }
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.error(error)
      message.error(error.response?.data?.message || 'Erro ao adicionar médico')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        ...doctor
      })
    }
  }, [doctor, form])

  return (
    <>
      <Modal
        className={styles.modal}
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <h2>{isEditMode ? 'Editar médico' : 'Adicionar médico'}</h2>

        <Form
          form={form}
          className={`${formStyles.form} mt-1`}
          layout='vertical'
          onFinish={onFinish}
        >
          <div className={styles.formInputs}>
            <FormItem
              label='Nome completo'
              name='name'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu nome completo' }]}
            >
              <Input placeholder='Digite seu nome completo' />
            </FormItem>

            <FormItem
              label='CPF'
              name='cpf'
              inputHeight={inputHeight}
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
              label='Data de nascimento'
              name='birthDate'
              inputHeight={inputHeight}
              rules={[
                { required: true, message: 'Informe sua data de nascimento' },
                {
                  validator(_, value) {
                    return birthDateValidator(value)
                  }
                }
              ]}
            >
              <InputDate
                inputHeight={inputHeight}
                onChange={(date) => form.setFieldsValue({ birthDate: date })}
              />
            </FormItem>

            <FormItem
              label='Gênero'
              name='gender'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu gênero' }]}
            >
              <InputSelect
                inputHeight={inputHeight}
                placeholder='Selecione seu gênero'
                options={Object.entries(UserGendersLabels).map(
                  ([key, value]) => ({
                    label: value,
                    value: key
                  })
                )}
              />
            </FormItem>

            <FormItem
              label='Email'
              name='email'
              inputHeight={inputHeight}
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
              <Input placeholder='Digite seu email' />
            </FormItem>

            <FormItem
              label='Senha'
              name='password'
              inputHeight={inputHeight}
              rules={[
                { required: true, message: 'Informe sua senha' },
                { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
              ]}
            >
              <Input.Password placeholder='Digite sua senha' />
            </FormItem>

            <FormItem
              label='Telefone'
              name='cellphone'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu telefone' }]}
            >
              <InputText mask='cellphone' placeholder='Digite seu telefone' />
            </FormItem>

            <FormItem
              label='CRM'
              name='crm'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu CRM' }]}
            >
              <InputText
                mask='crm'
                maxLength={9}
                placeholder='Digite seu CRM'
              />
            </FormItem>

            <FormItem
              label='Especialidade'
              name='specialization'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe sua especialidade' }]}
            >
              <InputSelect
                inputHeight={inputHeight}
                placeholder='Selecione sua especialidade'
                options={Object.entries(DoctorSpecializationsLabels).map(
                  ([key, value]) => ({
                    label: value,
                    value: key
                  })
                )}
              />
            </FormItem>

            {isOtherSpecialization && (
              <FormItem
                label='Especialidade não listada'
                name='otherSpecialization'
                inputHeight={inputHeight}
                rules={[
                  { required: true, message: 'Informe sua especialidade' }
                ]}
              >
                <Input placeholder='Digite sua especialidade não mapeada' />
              </FormItem>
            )}
          </div>

          <footer className={styles.footer}>
            <FormItem>
              <Button htmlType='submit' loading={loading}>
                {buttonText || 'Continuar'}
              </Button>
            </FormItem>
          </footer>
        </Form>
      </Modal>

      <Button loading={loading} onClick={handleOpen}>
        {buttonText || 'Continuar'}
      </Button>
    </>
  )
}

export default DoctorModal
