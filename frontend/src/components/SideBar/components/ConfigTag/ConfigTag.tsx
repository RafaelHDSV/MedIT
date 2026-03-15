import { GearIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import ProgressTag, { ProgressStatus } from '../../../ProgressTag/ProgressTag'
import styles from './ConfigTag.module.scss'
import ConfigModal from './components/ConfigModal/ConfigModal'

interface IConfigTagProps {
  isCompact: boolean
}

function ConfigTag({ isCompact }: IConfigTagProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  return (
    <>
      <ConfigModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      <button
        className={`${styles.tag} ${isModalOpen ? styles.activeTag : ''} ${isCompact ? styles.compact : ''}`}
        onClick={openModal}
      >
        <GearIcon size={22} />
        {!isCompact ? <span>Configurações</span> : null}

        <ProgressTag status={ProgressStatus.IN_PROGRESS} />
      </button>
    </>
  )
}

export default ConfigTag
