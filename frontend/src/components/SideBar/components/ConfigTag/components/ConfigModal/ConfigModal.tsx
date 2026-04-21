import Button from '@/components/Button/Button'
import DeleteModal from '@/components/DeleteModal/DeleteModal'
import DetailsLine from '@/components/DetailsLine/DetailsLine'
import { useAuth } from '@/hooks/useAuth'
import { useDevTasks } from '@/hooks/useDevTasks'
import { DoctorSpecializationsLabels } from '@/interfaces/IDoctor'
import { NurseShiftsLabels } from '@/interfaces/INurse'
import {
  UserGender,
  UserGendersLabels,
  UserLevels,
  UserLevelsLabels
} from '@/interfaces/IUser'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import masks from '@/utils/masks'
import { Checkbox, Divider, Input, message, Modal, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import dayjs from 'dayjs'
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

function ConfigBaseContent() {
  const { user } = useAuth()
  if (!user || !user?.level) return
  const isBiggerModal = user?.level !== UserLevels.ADMIN

  return (
    <div className={styles.section}>
      <Typography.Text className={styles.sectionLabel}>
        Informações básicas
      </Typography.Text>

      <div className={isBiggerModal ? styles.infoGrid : styles.singleInfoGrid}>
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
            value={`${dayjs(user.birthDate).format('DD/MM/YYYY')} (${getAgeByBirthDate(user.birthDate)} anos)`}
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
        {user?.crm && <DetailsLine label='CRM' value={user?.crm} />}
        {user?.specialization && (
          <DetailsLine
            label='Especialização'
            value={DoctorSpecializationsLabels[user?.specialization]}
          />
        )}
      </div>

      {/* VIEIRA: Adicionar funcionadalide de editar */}
      {/* <Typography.Text className={styles.sectionLabel}>
        Informações alteráveis
      </Typography.Text>

      <div className={styles.infoGrid}>
        <div className={styles.inputGroup}>
          <label>CRM</label>
          <Input value={user?.crm} />
        </div>
        <div className={styles.inputGroup}>
          <label>Especialidade</label>
          <Input
            value={
              DoctorSpecializationsLabels[
                user?.specialization as keyof typeof DoctorSpecializationsLabels
              ]
            }
          />
        </div>

        <div className={styles.inputGroup}>
          <label>COREN</label>
          <Input value={user?.coren} />
        </div>
      </div> */}

      <div className={styles.deleteArea}>
        <DeleteModal
          user={user}
          label='usuário'
          apiName='auth/users'
          buttonText='Deletar conta'
        />
      </div>
    </div>
  )
}

function ConfigContent({
  validDevelopmerEmail,
  devClicked
}: {
  validDevelopmerEmail: string[]
  devClicked: number
}) {
  const { user } = useAuth()

  if (
    validDevelopmerEmail.some((email) => user?.email?.includes(email)) &&
    devClicked > 0
  ) {
    return <ConfigDevContent />
  }

  return <ConfigBaseContent />
}

interface IConfigModalProps {
  isModalOpen: boolean
  setIsModalOpen: (bool: boolean) => void
}

function ConfigModal({ isModalOpen, setIsModalOpen }: IConfigModalProps) {
  const { user } = useAuth()
  const [devClicked, setDevClicked] = useState(5)
  const validDevelopmerEmail = ['vieira', 'rafa', 'take']
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
            onClick={() => setDevClicked((prev) => (prev > 0 ? prev - 1 : 5))}
          >
            {title}{' '}
            {validDevelopmerEmail.some((email) =>
              user?.email?.includes(email)
            ) && devClicked > 0
              ? devClicked
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
      width={isBiggerModal ? 720 : 460}
    >
      <ConfigContent
        validDevelopmerEmail={validDevelopmerEmail}
        devClicked={devClicked}
      />
    </Modal>
  )
}

export default ConfigModal
