import { useDevTasks } from '@/hooks/useDevTasks'
import { useSettings } from '@/hooks/useSettings'
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Modal,
  Switch,
  Typography
} from 'antd'
import { useState } from 'react'
import styles from './ConfigModal.module.scss'

interface IConfigModalProps {
  isModalOpen: boolean
  setIsModalOpen: (bool: boolean) => void
}

function ConfigModal({ isModalOpen, setIsModalOpen }: IConfigModalProps) {
  const { canSeeProgressStatus, setCanSeeProgressStatus } = useSettings()
  const { tasks, addTask, toggleTask, removeTask } = useDevTasks()
  const [newTask, setNewTask] = useState('')

  function closeModal() {
    setIsModalOpen(false)
  }

  function handleAddTask() {
    if (!newTask.trim()) return
    addTask(newTask)
    setNewTask('')
  }

  return (
    <Modal
      title={
        <div>
          <Typography.Title level={3}>Configurações</Typography.Title>
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
      <div className={styles.section}>
        <Typography.Title level={5}>Preferências</Typography.Title>

        <div className={styles.settingRow}>
          <span>Mostrar status de progresso</span>

          <Switch
            checked={canSeeProgressStatus}
            onChange={(checked) => setCanSeeProgressStatus(checked)}
          />
        </div>
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
    </Modal>
  )
}

export default ConfigModal
