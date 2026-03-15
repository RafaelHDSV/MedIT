import { GearIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import ProgressTag, { ProgressStatus } from '../../../ProgressTag/ProgressTag'
import styles from './ConfigTag.module.scss'
import ConfigModal from './components/ConfigModal/ConfigModal'

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
