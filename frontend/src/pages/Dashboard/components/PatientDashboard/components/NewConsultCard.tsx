import { PlusIcon } from '@phosphor-icons/react'
import styles from '../PatientDashboard.module.scss'

interface INewConsultCardProps {
  onClick: () => void
}

function NewConsultCard({ onClick }: INewConsultCardProps) {
  return (
    <div
      className={styles.newConsultCard}
      onClick={onClick}
      role='button'
      tabIndex={0}
      id='patient-new-consult-btn'
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
    >
      <div className={styles.plusBtn}>
        <PlusIcon size={40} weight='bold' />
      </div>
      <p>Clique para iniciar uma nova consulta</p>
    </div>
  )
}

export default NewConsultCard
