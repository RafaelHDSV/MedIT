import { PlusIcon } from '@phosphor-icons/react'
import styles from '../PatientDashboard.module.scss'

interface INewConsultCardProps {
  onClick: () => void
}

function NewConsultCard({ onClick }: INewConsultCardProps) {
  return (
    <button
      className={styles.newConsultCard}
      onClick={onClick}
      id='patient-new-consult-btn'
    >
      <div className={styles.plusBtn}>
        <PlusIcon size={40} weight='bold' />
      </div>
      <p>Clique para iniciar uma nova consulta</p>
    </button>
  )
}

export default NewConsultCard
