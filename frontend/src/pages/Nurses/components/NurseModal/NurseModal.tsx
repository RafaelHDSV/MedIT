import Button from '@/components/Button/Button'
import {
  FormItem,
  InputDate,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { DayjsType } from '@/components/MultiDatepicker/types'
import { handleApiError } from '@/helpers/handleApiError'
import { UF } from '@/interfaces/globals'
import {
  NurseCorenType,
  NurseShiftsLabels,
  type INurse,
  type INurseFormErrors,
  type NurseFormValues
} from '@/interfaces/INurse'
import { UserGendersLabels } from '@/interfaces/IUser'
import NursesRepository from '@/repositories/NursesRepository'
import validators, { birthDateValidator } from '@/utils/validators'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import formStyles from '../../../../components/FormComponents/FormComponents.module.scss'
import styles from './NurseModal.module.scss'

function formatCorenForApi(values: NurseFormValues): string {
  const digits = values.coren.replace(/\D/g, '').slice(0, 9)
  return `${digits}/${values.corenUf}-${values.corenType}`
}

function parseStoredCoren(
  coren?: string
): Pick<NurseFormValues, 'corenUf' | 'coren' | 'corenType'> | null {
  const raw = coren?.trim()
  if (!raw) return null

  const slash = raw.match(/^(\d{4,9})\/([A-Za-z]{2})-([A-Za-z0-9]+)$/)
  if (slash) {
    return {
      corenUf: slash[2].toUpperCase(),
      coren: slash[1],
      corenType: slash[3].toUpperCase() as NurseCorenType
    }
  }

  return null
}

function ModalContent({
  nurse,
  isModalOpen,
  setIsModalOpen,
  fetchNurses,
  fetchNurseDetails,
  btnText,
  useOnlyModal
}: {
  nurse: INurse | null | undefined
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  fetchNurses?: () => void
  fetchNurseDetails?: () => void
  btnText: string
  useOnlyModal?: boolean
}) {
  const [form] = useForm()
  const params = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<INurseFormErrors>({})
  const isEditMode = Boolean(nurse)

  const handleClose = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const inputHeight = '2.5rem'

  async function onFinish(values: NurseFormValues) {
    try {
      setLoading(true)

      if (isEditMode) {
        await NursesRepository.editNurse({
          nurseId: nurse?._id || params.id,
          body: {
            ...values,
            coren: formatCorenForApi(values)
          }
        })

        if (useOnlyModal) {
          fetchNurses?.()
        } else {
          fetchNurseDetails?.()
        }
      } else {
        await NursesRepository.createNurse({
          body: {
            ...values,
            coren: formatCorenForApi(values)
          }
        })
        fetchNurses?.()
      }

      message.success(
        `Enfermeiro(a) ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso`
      )
      handleClose()
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao adicionar enfermeiro(a)',
        setFieldErrors
      })
    } finally {
      setFieldErrors({})
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isModalOpen && nurse) {
      const parsed = parseStoredCoren(nurse.coren)
      form.setFieldsValue({
        ...nurse,
        ...(parsed ?? {})
      })
    }
  }, [nurse, form, isModalOpen])

  return (
    <Modal
      className={styles.modal}
      open={isModalOpen}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
      centered
    >
      <h2>
        {isEditMode
          ? `Editar ${nurse?.name ?? 'o enfermeiro(a)'}`
          : 'Adicionar enfermeiro(a)'}
      </h2>

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
              dateType={DayjsType.date}
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
            label='UF do COREN'
            name='corenUf'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe a UF do seu COREN' }]}
            validateStatus={fieldErrors.corenUf ? 'error' : undefined}
            help={fieldErrors.corenUf}
          >
            <InputSelect
              inputHeight={inputHeight}
              placeholder='Selecione a UF do seu COREN'
              options={Object.entries(UF).map(([key, value]) => ({
                label: value,
                value: key
              }))}
            />
          </FormItem>

          <FormItem
            label='COREN'
            name='coren'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe seu COREN' }]}
            validateStatus={fieldErrors.coren ? 'error' : undefined}
            help={fieldErrors.coren}
          >
            <InputText
              mask='coren'
              maxLength={7}
              placeholder='Digite seu COREN'
            />
          </FormItem>

          <FormItem
            label='Tipo do COREN'
            name='corenType'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe o tipo do seu COREN' }]}
            validateStatus={fieldErrors.corenType ? 'error' : undefined}
            help={fieldErrors.corenType}
          >
            <InputSelect
              inputHeight={inputHeight}
              placeholder='Digite o tipo do seu COREN'
              options={Object.entries(NurseCorenType).map(([key, value]) => ({
                label: value,
                value: key
              }))}
            />
          </FormItem>

          <FormItem
            label='Turno'
            name='shift'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Informe seu turno' }]}
            validateStatus={fieldErrors.shift ? 'error' : undefined}
            help={fieldErrors.shift}
          >
            <InputSelect
              inputHeight={inputHeight}
              placeholder='Selecione seu turno'
              options={Object.entries(NurseShiftsLabels).map(
                ([key, value]) => ({
                  label: value,
                  value: key
                })
              )}
            />
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

interface INurseModalProps {
  nurse?: INurse | null
  buttonText?: string
  fetchNurses?: () => void
  fetchNurseDetails?: () => void
  useOnlyModal?: boolean
  editModalOpen?: boolean
  setEditModalOpen?: (isOpen: boolean) => void
}

function NurseModal({
  nurse,
  buttonText,
  fetchNurses,
  fetchNurseDetails,
  useOnlyModal,
  editModalOpen,
  setEditModalOpen
}: INurseModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const btnText = buttonText || 'Continuar'

  const handleOpen = () => {
    if (fetchNurseDetails) fetchNurseDetails()
    setIsModalOpen(true)
  }

  if (useOnlyModal) {
    return (
      <ModalContent
        nurse={nurse}
        isModalOpen={editModalOpen || isModalOpen}
        setIsModalOpen={setEditModalOpen || setIsModalOpen}
        fetchNurses={fetchNurses}
        fetchNurseDetails={fetchNurseDetails}
        btnText={btnText}
        useOnlyModal={useOnlyModal}
      />
    )
  }

  return (
    <>
      <ModalContent
        nurse={nurse}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchNurses={fetchNurses}
        fetchNurseDetails={fetchNurseDetails}
        btnText={btnText}
      />

      <Button onClick={handleOpen}>{btnText}</Button>
    </>
  )
}

export default NurseModal
