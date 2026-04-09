import Button from '@/components/Button/Button'
import {
  FormItem,
  InputDate,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { DayjsType } from '@/components/MultiDatepicker/types'
import { handleApiError } from '@/helpers/handleApiError'
import {
  BloodType,
  type IPatient,
  type IPatientFormErrors,
  type PatientFormValues
} from '@/interfaces/IPatient'
import { UserGendersLabels } from '@/interfaces/IUser'
import PatientsRepository from '@/repositories/PatientsRepository'
import validators, { birthDateValidator } from '@/utils/validators'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import formStyles from '../../../../components/ListTable/ListTable.module.scss'
import styles from './PatientModal.module.scss'

function ModalContent({
  patient,
  isModalOpen,
  setIsModalOpen,
  fetchPatients,
  fetchPatientDetails,
  btnText,
  useOnlyModal
}: {
  patient: IPatient | null | undefined
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  fetchPatients?: () => void
  fetchPatientDetails?: () => void
  btnText: string
  useOnlyModal?: boolean
}) {
  const [form] = useForm()
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<IPatientFormErrors>({})

  const handleClose = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const inputHeight = '2.5rem'

  async function onFinish(values: PatientFormValues) {
    try {
      setLoading(true)

      await PatientsRepository.editPatient({
        patientId: patient?._id || params.id,
        body: {
          ...values
        }
      })

      if (useOnlyModal) {
        fetchPatients?.()
      } else {
        fetchPatientDetails?.()
      }

      message.success(`Paciente atualizado com sucesso`)
      handleClose()
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao adicionar paciente',
        setFieldErrors
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isModalOpen && patient) {
      form.setFieldsValue({
        ...patient,
        conditions: patient.conditions?.join(', '),
        allergies: patient.allergies?.join(', ')
      })
    }
  }, [patient, form, fetchPatientDetails, isModalOpen])

  return (
    <Modal
      className={styles.modal}
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      centered
    >
      <h2>Editar {patient?.name ?? 'paciente'}</h2>

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
              dateType={DayjsType.date}
              onChange={(date) => form.setFieldsValue({ birthDate: date })}
            />
          </FormItem>

          <FormItem
            label='Gênero'
            name='gender'
            inputHeight={inputHeight}
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

          <FormItem
            label='Senha atual'
            name='currentPassword'
            inputHeight={inputHeight}
            rules={[
              { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
            ]}
            validateStatus={fieldErrors.currentPassword ? 'error' : undefined}
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

          <FormItem
            label='Telefone'
            name='cellphone'
            inputHeight={inputHeight}
            validateStatus={fieldErrors.cellphone ? 'error' : undefined}
            help={fieldErrors.cellphone}
          >
            <InputText mask='cellphone' placeholder='Digite seu telefone' />
          </FormItem>

          <FormItem
            label='Peso'
            name='weight'
            inputHeight={inputHeight}
            validateStatus={fieldErrors.weight ? 'error' : undefined}
            help={fieldErrors.weight}
          >
            <InputText
              type='number'
              placeholder='Digite seu peso'
              suffix='kg'
              maxLength={4}
            />
          </FormItem>

          <FormItem
            label='Altura'
            name='height'
            inputHeight={inputHeight}
            validateStatus={fieldErrors.height ? 'error' : undefined}
            help={fieldErrors.height}
          >
            <InputText
              mask='height'
              type='number'
              placeholder='Digite sua altura'
              suffix='m'
            />
          </FormItem>

          <FormItem
            label='Tipo sanguíneo'
            name='bloodType'
            inputHeight={inputHeight}
            validateStatus={fieldErrors.bloodType ? 'error' : undefined}
            help={fieldErrors.bloodType}
          >
            <InputSelect
              inputHeight={inputHeight}
              placeholder='Selecione seu tipo sanguíneo'
              options={Object.entries(BloodType).map(([, value]) => ({
                label: value,
                value
              }))}
            />
          </FormItem>

          <FormItem
            label='Condições médicas'
            name='conditions'
            inputHeight={inputHeight}
            validateStatus={fieldErrors.conditions ? 'error' : undefined}
            help={fieldErrors.conditions}
          >
            <InputText placeholder='Digite suas condições médicas' />
          </FormItem>

          <FormItem
            label='Alergias'
            name='allergies'
            inputHeight={inputHeight}
            validateStatus={fieldErrors.allergies ? 'error' : undefined}
            help={fieldErrors.allergies}
          >
            <InputText placeholder='Digite suas alergias' />
          </FormItem>
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

interface IPatientModalProps {
  patient?: IPatient | null
  buttonText?: string
  fetchPatients?: () => void
  fetchPatientDetails?: () => void
  useOnlyModal?: boolean
  editModalOpen?: boolean
  setEditModalOpen?: (isOpen: boolean) => void
}

function PatientModal({
  patient,
  buttonText,
  fetchPatients,
  fetchPatientDetails,
  useOnlyModal,
  editModalOpen,
  setEditModalOpen
}: IPatientModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const btnText = buttonText || 'Continuar'

  const handleOpen = () => {
    if (fetchPatientDetails) fetchPatientDetails()
    setIsModalOpen(true)
  }

  if (useOnlyModal) {
    return (
      <ModalContent
        patient={patient}
        isModalOpen={editModalOpen || isModalOpen}
        setIsModalOpen={setEditModalOpen || setIsModalOpen}
        fetchPatients={fetchPatients}
        fetchPatientDetails={fetchPatientDetails}
        btnText={btnText}
        useOnlyModal={useOnlyModal}
      />
    )
  }

  return (
    <>
      <ModalContent
        patient={patient}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchPatients={fetchPatients}
        fetchPatientDetails={fetchPatientDetails}
        btnText={btnText}
      />

      <Button onClick={handleOpen}>{btnText}</Button>
    </>
  )
}

export default PatientModal
