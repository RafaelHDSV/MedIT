import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { useState, type ReactNode } from 'react'
import styles from './Alert.module.scss'

type AlertType = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  message: ReactNode
  description?: ReactNode
  type?: AlertType
  closable?: boolean
  onClose?: () => void
  className?: string
}

const ICONS: Record<AlertType, ReactNode> = {
  info: <InfoCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
  error: <CloseCircleOutlined />
}

export default function Alert({
  message,
  description,
  type = 'info',
  closable = true,
  onClose,
  className
}: AlertProps) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  function handleClose() {
    setVisible(false)
    onClose?.()
  }

  return (
    <div className={`${styles.alert} ${styles[type]} ${className ?? ''}`}>
      <span className={styles.icon}>{ICONS[type]}</span>

      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        {description && (
          <span className={styles.description}>{description}</span>
        )}
      </div>

      {closable && (
        <button
          className={styles.closeBtn}
          onClick={handleClose}
          aria-label='Fechar alerta'
        >
          <CloseOutlined />
        </button>
      )}
    </div>
  )
}
