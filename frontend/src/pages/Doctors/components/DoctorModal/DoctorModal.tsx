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
  type IDoctor,
  type IDoctorFormErrors
} from '@/interfaces/IDoctor'
import type { IError } from '@/interfaces/IError'
import { UserGendersLabels } from '@/interfaces/IUser'
import capitalize from '@/utils/capitalize'
import masks from '@/utils/masks'
import validators, { birthDateValidator } from '@/utils/validators'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import formStyles from '../../../../components/FormComponents/FormComponents.module.scss'
import styles from './DoctorModal.module.scss'

function ModalContent({
  doctor,
  isModalOpen,
  setIsModalOpen,
  fetchDoctors,
  fetchDoctorDetails,
  btnText,
  useOnlyModal
}: {
  doctor: IDoctor | null | undefined
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  fetchDoctors?: () => void
  fetchDoctorDetails?: () => void
  btnText: string
  useOnlyModal?: boolean
}) {
  const [form] = useForm()
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<IDoctorFormErrors>({})
  const isEditMode = Boolean(doctor)

  const handleClose = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const inputHeight = '2.5rem'

  const specialization = Form.useWatch('specialization', form)
  const isMappedSpecialization = Object.values(DoctorSpecializations).includes(
    doctor?.specialization as DoctorSpecializations
  )
  const isOtherSpecialization =
    specialization && specialization === DoctorSpecializations.OTHER

  async function onFinish(values: DoctorFormValues) {
    try {
      setLoading(true)

      if (isEditMode) {
        await api.put(`/doctors/${doctor?._id || params.id}`, {
          ...values,
          crm: masks(values.crm, 'crm')
        })

        if (useOnlyModal) {
          fetchDoctors?.()
        } else {
          fetchDoctorDetails?.()
        }
      } else {
        await api.post('/doctors', { ...values, crm: masks(values.crm, 'crm') })
        fetchDoctors?.()
      }

      message.success(
        `Médico ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso`
      )
      handleClose()
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>

      if (error.response?.data?.errors) {
        setFieldErrors(error.response?.data?.errors)
        console.error(error)
        message.error(
          error.response?.data?.message ||
            'Erro nas validações ao adicionar médico'
        )
      } else {
        console.error(error)
        message.error(
          error.response?.data?.message || 'Erro ao adicionar médico'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (doctor) {
      form.setFieldsValue({
        ...doctor,
        specialization: isMappedSpecialization
          ? (doctor.specialization as DoctorSpecializations)
          : (DoctorSpecializations.OTHER as DoctorSpecializations),
        otherSpecialization: !isMappedSpecialization
          ? capitalize(doctor.specialization)
          : undefined
      })
    }
  }, [doctor, form, isMappedSpecialization])

  return (
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
            validateStatus={fieldErrors.name ? 'error' : undefined}
            help={fieldErrors.name}
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
            validateStatus={fieldErrors.cpf ? 'error' : undefined}
            help={fieldErrors.cpf}
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
            validateStatus={fieldErrors.birthDate ? 'error' : undefined}
            help={fieldErrors.birthDate}
          >
            <InputDate
              value={form.getFieldValue('birthDate')}
              inputHeight={inputHeight}
              onChange={(date) => form.setFieldsValue({ birthDate: date })}
            />
          </FormItem>

          <FormItem
            label='Gênero'
            name='gender'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe seu gênero' }]}
            validateStatus={fieldErrors.gender ? 'error' : undefined}
            help={fieldErrors.gender}
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
            validateStatus={fieldErrors.email ? 'error' : undefined}
            help={fieldErrors.email}
          >
            <Input placeholder='Digite seu email' />
          </FormItem>

          {isEditMode ? (
            <>
              <FormItem
                label='Senha atual'
                name='currentPassword'
                inputHeight={inputHeight}
                rules={[
                  { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
                ]}
                validateStatus={
                  fieldErrors.currentPassword ? 'error' : undefined
                }
                help={fieldErrors.currentPassword}
              >
                <Input.Password placeholder='Digite sua senha atual' />
              </FormItem>

              <FormItem
                label='Nova senha'
                name='newPassword'
                inputHeight={inputHeight}
                rules={[
                  { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
                ]}
                validateStatus={fieldErrors.newPassword ? 'error' : undefined}
                help={fieldErrors.newPassword}
              >
                <Input.Password placeholder='Digite sua nova senha (opcional)' />
              </FormItem>
            </>
          ) : (
            <FormItem
              label='Senha'
              name='password'
              inputHeight={inputHeight}
              rules={[
                { required: true, message: 'Informe sua senha' },
                { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
              ]}
              validateStatus={fieldErrors.password ? 'error' : undefined}
              help={fieldErrors.password}
            >
              <Input.Password placeholder='Digite sua senha' />
            </FormItem>
          )}

          <FormItem
            label='Telefone'
            name='cellphone'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe seu telefone' }]}
            validateStatus={fieldErrors.cellphone ? 'error' : undefined}
            help={fieldErrors.cellphone}
          >
            <InputText mask='cellphone' placeholder='Digite seu telefone' />
          </FormItem>

          <FormItem
            label='CRM'
            name='crm'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe seu CRM' }]}
            validateStatus={fieldErrors.crm ? 'error' : undefined}
            help={fieldErrors.crm}
          >
            <InputText mask='crm' maxLength={9} placeholder='Digite seu CRM' />
          </FormItem>

          <FormItem
            label='Especialidade'
            name='specialization'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe sua especialidade' }]}
            validateStatus={fieldErrors.specialization ? 'error' : undefined}
            help={fieldErrors.specialization}
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
              rules={[{ required: true, message: 'Informe sua especialidade' }]}
              validateStatus={
                fieldErrors.otherSpecialization ? 'error' : undefined
              }
              help={fieldErrors.otherSpecialization}
            >
              <Input placeholder='Digite sua especialidade não mapeada' />
            </FormItem>
          )}
        </div>

        <footer className={styles.footer}>
          <FormItem>
            <Button htmlType='submit' loading={loading}>
              {btnText}
            </Button>
          </FormItem>
        </footer>
      </Form>
    </Modal>
  )
}

interface IDoctorModalProps {
  doctor?: IDoctor | null
  buttonText?: string
  fetchDoctors?: () => void
  fetchDoctorDetails?: () => void
  useOnlyModal?: boolean
  editModalOpen?: boolean
  setEditModalOpen?: (isOpen: boolean) => void
}

function DoctorModal({
  doctor,
  buttonText,
  fetchDoctors,
  fetchDoctorDetails,
  useOnlyModal,
  editModalOpen,
  setEditModalOpen
}: IDoctorModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const btnText = buttonText || 'Continuar'

  const handleOpen = () => {
    if (fetchDoctorDetails) fetchDoctorDetails()
    setIsModalOpen(true)
  }

  if (useOnlyModal) {
    return (
      <ModalContent
        doctor={doctor}
        isModalOpen={editModalOpen || isModalOpen}
        setIsModalOpen={setEditModalOpen || setIsModalOpen}
        fetchDoctors={fetchDoctors}
        fetchDoctorDetails={fetchDoctorDetails}
        btnText={btnText}
        useOnlyModal={useOnlyModal}
      />
    )
  }

  return (
    <>
      <ModalContent
        doctor={doctor}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchDoctors={fetchDoctors}
        fetchDoctorDetails={fetchDoctorDetails}
        btnText={btnText}
      />

      <Button onClick={handleOpen}>{btnText}</Button>
    </>
  )
}

export default DoctorModal
