import { useSettings } from '@/hooks/useSettings'
import { GearIcon } from '@phosphor-icons/react'
import { Modal, Switch, Typography } from 'antd'
import { useState } from 'react'
import ProgressTag, { ProgressStatus } from '../../../ProgressTag/ProgressTag'
import styles from './ConfigTag.module.scss'

interface IConfigModalProps {
  isModalOpen: boolean
  setIsModalOpen: (bool: boolean) => void
}

function ConfigModal({ isModalOpen, setIsModalOpen }: IConfigModalProps) {
  const { canSeeProgressStatus, setCanSeeProgressStatus } = useSettings()

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
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
    >
      <Switch
        checked={canSeeProgressStatus}
        onChange={(checked) => setCanSeeProgressStatus(checked)}
      />
    </Modal>
  )
}

function ConfigTag() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  return (
    <>
      <ConfigModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <button
        className={`${styles.tag} ${isModalOpen ? styles.activeTag : ''}`}
        onClick={openModal}
      >
        <GearIcon size={22} />
        <span>Configurações</span>

        <ProgressTag status={ProgressStatus.IN_PROGRESS} />
      </button>
    </>
  )
}

export default ConfigTag
