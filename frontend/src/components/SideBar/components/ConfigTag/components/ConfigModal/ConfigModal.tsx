import Button from '@/components/Button/Button'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import DetailsLine from '@/components/DetailsLine/DetailsLine'
import {
  FormItem,
  InputDate,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { DayjsType } from '@/components/MultiDatepicker/types'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import { useDevTasks } from '@/hooks/useDevTasks'
import { UF } from '@/interfaces/globals'
import { DoctorSpecializationsLabels } from '@/interfaces/IDoctor'
import { NurseCorenType, NurseShiftsLabels } from '@/interfaces/INurse'
import { BloodType } from '@/interfaces/IPatient'
import {
  UserGender,
  UserGendersLabels,
  UserLevels,
  UserLevelsLabels,
  type ConfigFormValues
} from '@/interfaces/IUser'
import UserRepository from '@/repositories/UserRepository'
import { formatDate } from '@/utils/formatDate'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import validators, { birthDateValidator } from '@/utils/validators'
import {
  Checkbox,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Typography
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import { useMemo, useState } from 'react'
import styles from './ConfigModal.module.scss'

function ConfigDevContent() {
  const { tasks, addTask, toggleTask, removeTask } = useDevTasks()
  const [newTask, setNewTask] = useState('')
  const [tasksJson, setTasksJson] = useState('')
  const [visibleEditInput, setVisibleEditInput] = useState(false)

  function handleAddTask() {
    if (!newTask.trim()) return
    addTask(newTask)
    setNewTask('')
  }

  function handleToggleEdit() {
    setVisibleEditInput((prev) => {
      const next = !prev

      if (!prev) {
        setTasksJson(JSON.stringify(tasks, null, 2))
      }

      return next
    })
  }

  return (
    <>
      <div className={styles.section}>
        <Typography.Title level={5}>Preferências</Typography.Title>

        <div className={styles.settingRow}>
          <span>Alterar ordenação</span>

          <Button onClick={handleToggleEdit}>Editar</Button>
        </div>

        {visibleEditInput && (
          <>
            <TextArea
              rows={15}
              value={tasksJson}
              onChange={(e) => setTasksJson(e.target.value)}
            />

            <Button
              type='primary'
              onClick={() => {
                try {
                  const parsed = JSON.parse(tasksJson)

                  localStorage.setItem('devTasks', JSON.stringify(parsed))

                  window.location.reload()
                } catch {
                  message.error('JSON inválido')
                }
              }}
            >
              Salvar alterações
            </Button>
          </>
        )}
      </div>

      <Divider />

      <div className={styles.section}>
        <div>
          <Typography.Title level={5}>
            Desenvolvimento ({tasks.length})
          </Typography.Title>
          <Typography.Paragraph type='secondary'>
            Lista de tarefas pendentes do projeto.
          </Typography.Paragraph>
        </div>

        <div className={styles.addTask}>
          <Input
            placeholder='Nova tarefa'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onPressEnter={handleAddTask}
          />

          <Button type='primary' onClick={handleAddTask}>
            Adicionar
          </Button>
        </div>

        <div className={styles.taskList}>
          {tasks.map((task) => (
            <div key={task.id} className={styles.taskItem}>
              <Checkbox
                checked={task.done}
                onChange={() => toggleTask(task.id)}
              >
                <span className={task.done ? styles.taskDone : ''}>
                  {task.title}
                </span>
              </Checkbox>

              <Button
                mode='outline'
                type='text'
                danger
                size='small'
                onClick={() => removeTask(task.id)}
              >
                Remover
              </Button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ConfigBaseContent({
  isEditing,
  setIsEditing
}: {
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
}) {
  const { user, updateUser } = useAuth()
  const [form] = useForm()
  const [saving, setSaving] = useState(false)
  if (!user || !user?.level) return
  const currentUser = user
  const isBiggerModal = user?.level !== UserLevels.ADMIN

  function parseStoredCoren(coren?: string): {
    corenUf?: string
    coren?: string
    corenType?: string
  } {
    const raw = coren?.trim()
    if (!raw) return {}
    const slash = raw.match(/^(\d{4,9})\/([A-Za-z]{2})-([A-Za-z0-9]+)$/)
    if (!slash) return {}
    return {
      corenUf: slash[2].toUpperCase(),
      coren: slash[1],
      corenType: slash[3].toUpperCase()
    }
  }

  function getInitialValues() {
    const parsedCoren = parseStoredCoren(currentUser?.coren)
    return {
      name: currentUser.name,
      cpf: currentUser.cpf,
      email: currentUser.email,
      gender: currentUser.gender,
      birthDate: currentUser.birthDate,
      cellphone: currentUser.cellphone
        ? String(currentUser.cellphone)
        : undefined,
      crm: currentUser?.crm,
      specialization: currentUser?.specialization,
      shift: currentUser?.shift,
      workLocationLabel: currentUser?.workLocationLabel,
      weight: currentUser?.weight,
      height: currentUser?.height,
      bloodType: currentUser?.bloodType,
      conditions: Array.isArray(currentUser?.conditions)
        ? currentUser.conditions.join(', ')
        : undefined,
      allergies: Array.isArray(currentUser?.allergies)
        ? currentUser.allergies.join(', ')
        : undefined,
      ...parsedCoren,
      currentPassword: undefined,
      newPassword: undefined,
      confirmPassword: undefined
    }
  }

  function startEdit() {
    form.setFieldsValue(getInitialValues())
    setIsEditing(true)
  }

  function cancelEdit() {
    form.resetFields()
    setIsEditing(false)
  }

  async function handleSave(values: ConfigFormValues) {
    if (!isEditing) return

    if (values.newPassword && !values.currentPassword) {
      message.warning('Informe a senha atual para alterar a senha.')
      return
    }
    if (values.newPassword && values.newPassword !== values.confirmPassword) {
      message.warning('A confirmação da nova senha não confere.')
      return
    }

    const payload: Record<string, unknown> = {
      name: values.name?.trim(),
      email: values.email?.trim(),
      cpf: values.cpf,
      gender: values.gender,
      birthDate: values.birthDate,
      cellphone: values.cellphone
    }

    if (values.newPassword) {
      payload.currentPassword = values.currentPassword
      payload.newPassword = values.newPassword
    }

    if (currentUser.level === UserLevels.DOCTOR) {
      payload.crm = values.crm
      payload.specialization = values.specialization
      payload.workLocationLabel = values.workLocationLabel
    }

    if (currentUser.level === UserLevels.NURSE) {
      if (values.coren && values.corenUf && values.corenType) {
        payload.coren = `${String(values.coren).replace(/\D/g, '').slice(0, 9)}/${values.corenUf}-${values.corenType}`
      }
      payload.shift = values.shift
      payload.workLocationLabel = values.workLocationLabel
    }

    if (currentUser.level === UserLevels.PATIENT) {
      payload.weight = values.weight
      payload.height = values.height
      payload.bloodType = values.bloodType
      payload.conditions = values.conditions
      payload.allergies = values.allergies
    }

    try {
      setSaving(true)
      const response = await UserRepository.updateMe({ body: payload })
      updateUser(response.data)
      message.success('Dados atualizados com sucesso.')
      setIsEditing(false)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Não foi possível atualizar seus dados.'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.section}>
      {!isEditing ? (
        <div
          className={isBiggerModal ? styles.infoGrid : styles.singleInfoGrid}
        >
          <DetailsLine label='ID' value={user.number} />
          <DetailsLine label='Nome' value={user.name} />
          <DetailsLine label='CPF' value={masks(user.cpf, 'cpf')} />
          <DetailsLine label='E-mail' value={user.email} />
          {user.gender && (
            <DetailsLine
              label='Sexo'
              value={UserGendersLabels[user.gender as UserGender]}
            />
          )}
          {user.birthDate && (
            <DetailsLine
              label='Data de nascimento'
              value={`${formatDate({ date: user.birthDate, mode: 'date' })} (${getAgeByBirthDate(user.birthDate)} anos)`}
            />
          )}
          {user.cellphone && (
            <DetailsLine
              label='Telefone'
              value={masks(user.cellphone, 'cellphone')}
            />
          )}
          {user?.bloodType && (
            <DetailsLine label='Tipo sanguíneo' value={user?.bloodType} />
          )}
          {user?.height && (
            <DetailsLine label='Altura' value={`${user?.height} m`} />
          )}
          {user?.weight && (
            <DetailsLine label='Peso' value={`${user?.weight} kg`} />
          )}
          {user?.coren && <DetailsLine label='COREN' value={user?.coren} />}
          {user?.shift && (
            <DetailsLine label='Turno' value={NurseShiftsLabels[user?.shift]} />
          )}
          {(user as { workLocationLabel?: string })?.workLocationLabel && (
            <DetailsLine
              label='Sala / local (paciente)'
              value={
                (user as { workLocationLabel?: string }).workLocationLabel
              }
            />
          )}
          {user?.crm && <DetailsLine label='CRM' value={user?.crm} />}
          {user?.specialization && (
            <DetailsLine
              label='Especialização'
              value={DoctorSpecializationsLabels[user?.specialization]}
            />
          )}
        </div>
      ) : (
        <Form
          form={form}
          layout='vertical'
          className={styles.editForm}
          onFinish={handleSave}
        >
          <div className={styles.infoGrid}>
            <FormItem
              label='Nome completo'
              name='name'
              inputHeight='2.5rem'
              rules={[{ required: true, message: 'Informe seu nome completo' }]}
            >
              <Input placeholder='Digite seu nome completo' />
            </FormItem>

            <FormItem
              label='CPF'
              name='cpf'
              inputHeight='2.5rem'
              rules={[
                { required: true, message: 'Informe seu CPF' },
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve()
                    return validators(value, 'validCpf')
                      ? Promise.resolve()
                      : Promise.reject(new Error('CPF inválido'))
                  }
                }
              ]}
            >
              <InputText mask='cpf' placeholder='Digite seu CPF' />
            </FormItem>

            <FormItem
              label='E-mail'
              name='email'
              inputHeight='2.5rem'
              rules={[
                { required: true, message: 'Informe seu email' },
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve()
                    return validators(value, 'email')
                      ? Promise.resolve()
                      : Promise.reject(new Error('Email inválido'))
                  }
                }
              ]}
            >
              <Input placeholder='Digite seu e-mail' />
            </FormItem>

            <FormItem label='Telefone' name='cellphone' inputHeight='2.5rem'>
              <InputText mask='cellphone' placeholder='Digite seu telefone' />
            </FormItem>

            <FormItem
              label='Data de nascimento'
              name='birthDate'
              inputHeight='2.5rem'
              rules={[
                {
                  validator(_, value) {
                    return birthDateValidator(value)
                  }
                }
              ]}
            >
              <InputDate
                value={form.getFieldValue('birthDate')}
                inputHeight='2.5rem'
                dateType={DayjsType.date}
                onChange={(date) => form.setFieldsValue({ birthDate: date })}
              />
            </FormItem>

            <FormItem label='Gênero' name='gender' inputHeight='2.5rem'>
              <InputSelect
                inputHeight='2.5rem'
                placeholder='Selecione'
                options={Object.entries(UserGendersLabels).map(
                  ([key, value]) => ({
                    label: value,
                    value: key
                  })
                )}
              />
            </FormItem>

            {user.level === UserLevels.DOCTOR && (
              <>
                <FormItem label='CRM' name='crm' inputHeight='2.5rem'>
                  <InputText
                    mask='crm'
                    maxLength={9}
                    placeholder='Digite seu CRM'
                  />
                </FormItem>
                <FormItem
                  label='Especialização'
                  name='specialization'
                  inputHeight='2.5rem'
                >
                  <InputSelect
                    inputHeight='2.5rem'
                    placeholder='Selecione'
                    options={Object.entries(DoctorSpecializationsLabels).map(
                      ([key, value]) => ({
                        label: value,
                        value: key
                      })
                    )}
                  />
                </FormItem>
                <FormItem
                  label='Sala ou consultório (visto pelo paciente)'
                  name='workLocationLabel'
                  inputHeight='2.5rem'
                  rules={[
                    { required: true, message: 'Informe a sala ou o consultório' },
                    { max: 120, message: 'No máximo 120 caracteres' }
                  ]}
                >
                  <Input placeholder='Ex.: Consultório 3' />
                </FormItem>
              </>
            )}

            {user.level === UserLevels.NURSE && (
              <>
                <FormItem
                  label='UF do COREN'
                  name='corenUf'
                  inputHeight='2.5rem'
                >
                  <InputSelect
                    inputHeight='2.5rem'
                    placeholder='Selecione'
                    options={Object.entries(UF).map(([key, value]) => ({
                      label: value,
                      value: key
                    }))}
                  />
                </FormItem>
                <FormItem label='COREN' name='coren' inputHeight='2.5rem'>
                  <InputText
                    mask='coren'
                    maxLength={7}
                    placeholder='Digite seu COREN'
                  />
                </FormItem>
                <FormItem
                  label='Tipo do COREN'
                  name='corenType'
                  inputHeight='2.5rem'
                >
                  <InputSelect
                    inputHeight='2.5rem'
                    placeholder='Selecione'
                    options={Object.entries(NurseCorenType).map(
                      ([key, value]) => ({
                        label: value,
                        value: key
                      })
                    )}
                  />
                </FormItem>
                <FormItem label='Turno' name='shift' inputHeight='2.5rem'>
                  <InputSelect
                    inputHeight='2.5rem'
                    placeholder='Selecione'
                    options={Object.entries(NurseShiftsLabels).map(
                      ([key, value]) => ({
                        label: value,
                        value: key
                      })
                    )}
                  />
                </FormItem>
                <FormItem
                  label='Sala ou local de triagem (visto pelo paciente)'
                  name='workLocationLabel'
                  inputHeight='2.5rem'
                  rules={[
                    {
                      required: true,
                      message: 'Informe a sala ou o local de triagem'
                    },
                    { max: 120, message: 'No máximo 120 caracteres' }
                  ]}
                >
                  <Input placeholder='Ex.: Sala de triagem 2' />
                </FormItem>
              </>
            )}

            {user.level === UserLevels.PATIENT && (
              <>
                <FormItem label='Peso' name='weight' inputHeight='2.5rem'>
                  <InputText type='number' suffix='kg' placeholder='Peso' />
                </FormItem>
                <FormItem label='Altura' name='height' inputHeight='2.5rem'>
                  <InputText
                    mask='height'
                    type='number'
                    suffix='m'
                    placeholder='Altura'
                  />
                </FormItem>
                <FormItem
                  label='Tipo sanguíneo'
                  name='bloodType'
                  inputHeight='2.5rem'
                >
                  <InputSelect
                    inputHeight='2.5rem'
                    placeholder='Selecione'
                    options={Object.entries(BloodType).map(([, value]) => ({
                      label: value,
                      value
                    }))}
                  />
                </FormItem>
                <FormItem
                  label='Condições médicas'
                  name='conditions'
                  inputHeight='2.5rem'
                >
                  <InputText placeholder='Separe por vírgula' />
                </FormItem>
                <FormItem
                  label='Alergias'
                  name='allergies'
                  inputHeight='2.5rem'
                >
                  <InputText placeholder='Separe por vírgula' />
                </FormItem>
              </>
            )}
          </div>

          <Divider />
          <Typography.Text className={styles.sectionLabel}>
            Alteração de senha
          </Typography.Text>
          <div className={styles.infoGrid}>
            <FormItem
              label='Senha atual'
              name='currentPassword'
              inputHeight='2.5rem'
              rules={[
                { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
              ]}
            >
              <Input.Password placeholder='Digite sua senha atual' />
            </FormItem>
            <FormItem
              label='Nova senha'
              name='newPassword'
              inputHeight='2.5rem'
              rules={[
                { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
              ]}
            >
              <Input.Password placeholder='Digite sua nova senha (opcional)' />
            </FormItem>
            <FormItem
              label='Confirmar nova senha'
              name='confirmPassword'
              inputHeight='2.5rem'
            >
              <Input.Password placeholder='Confirme sua nova senha' />
            </FormItem>
          </div>
        </Form>
      )}

      <div className={styles.footerActions}>
        {!isEditing ? (
          <>
            <Button onClick={startEdit}>Editar dados</Button>
            <DeleteModal
              user={user}
              label='usuário'
              apiName='auth/users'
              buttonText='Deletar conta'
            />
          </>
        ) : (
          <>
            <Button mode='outline' onClick={cancelEdit}>
              Cancelar
            </Button>
            <Button loading={saving} onClick={() => form.submit()}>
              Salvar
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function ConfigContent({
  validDevelopmerEmail,
  devClicked,
  isEditing,
  setIsEditing,
  showDevUi
}: {
  validDevelopmerEmail: string[]
  devClicked: number
  isEditing: boolean
  setIsEditing: (bool: boolean) => void
  showDevUi: boolean
}) {
  const { user } = useAuth()

  if (
    showDevUi &&
    validDevelopmerEmail.some((email) => user?.email?.includes(email)) &&
    devClicked > 0
  ) {
    return <ConfigDevContent />
  }

  return <ConfigBaseContent isEditing={isEditing} setIsEditing={setIsEditing} />
}

interface IConfigModalProps {
  isModalOpen: boolean
  setIsModalOpen: (bool: boolean) => void
}

function ConfigModal({ isModalOpen, setIsModalOpen }: IConfigModalProps) {
  const { user } = useAuth()
  const [devClicked, setDevClicked] = useState(5)
  const [isEditing, setIsEditing] = useState(false)
  const validDevelopmerEmail = ['vieira', 'rafa', 'take']
  const showDevUi = import.meta.env.DEV
  const isBiggerModal = user?.level !== UserLevels.ADMIN

  function closeModal() {
    setIsModalOpen(false)
  }

  const title = useMemo(() => {
    if (user?.level) return `Configuração do ${UserLevelsLabels[user?.level]}`
    return 'Configurações'
  }, [user?.level])

  return (
    <Modal
      title={
        <div>
          <Typography.Title
            level={3}
            onClick={
              showDevUi
                ? () => setDevClicked((prev) => (prev > 0 ? prev - 1 : 5))
                : undefined
            }
          >
            {title}{' '}
            {showDevUi &&
            validDevelopmerEmail.some((email) =>
              user?.email?.includes(email)
            ) &&
            devClicked > 0
              ? `Contador: (${devClicked})`
              : ''}
          </Typography.Title>
          <Typography.Paragraph>
            Aqui você pode ajustar suas preferências e configurações de conta.
          </Typography.Paragraph>
        </div>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      centered
      width={isBiggerModal || isEditing ? 720 : 460}
    >
      <ConfigContent
        validDevelopmerEmail={validDevelopmerEmail}
        devClicked={devClicked}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        showDevUi={showDevUi}
      />
    </Modal>
  )
}

export default ConfigModal
