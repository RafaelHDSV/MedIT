import Button from '@/components/Button/Button'
import { useAuth } from '@/hooks/useAuth'
import { useDevTasks } from '@/hooks/useDevTasks'
import { UserLevelsLabels } from '@/interfaces/IUser'
import { Checkbox, Divider, Input, message, Modal, Typography } from 'antd'
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
            placeholder='Nova tarefa...'
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
                mode='secondary'
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
  if (!user?.level) return

  return <h2>Configuração do {UserLevelsLabels[user?.level]}</h2>
}

function ConfigContent() {
  const { user } = useAuth()
  const validDevelopmerEmail = ['vieira', 'rafa', 'take']

  if (
    user &&
    validDevelopmerEmail.some((email) => user.email.includes(email))
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
          <Typography.Title level={3}>{title}</Typography.Title>
          <Typography.Paragraph>
            Aqui você pode ajustar suas preferências e configurações de conta.
          </Typography.Paragraph>
        </div>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      centered
      width={520}
    >
      <ConfigContent />
    </Modal>
  )
}

export default ConfigModal
