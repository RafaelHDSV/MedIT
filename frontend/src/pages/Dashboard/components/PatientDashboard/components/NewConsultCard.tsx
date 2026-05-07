import { PlusIcon } from '@phosphor-icons/react'
import { Skeleton } from 'antd'
import styles from '../PatientDashboard.module.scss'

interface INewConsultCardProps {
  loading: boolean
  onClick: () => void
}

function NewConsultCard({ loading, onClick }: INewConsultCardProps) {
  if (loading) {
    return (
      <div className={styles.newConsultCard}>
        <div className={styles.plusBtn}>
          <PlusIcon size={40} weight='bold' />
        </div>

        <Skeleton
          active
          title={false}
          paragraph={{ rows: 1 }}
          className='w-100'
        />
      </div>
    )
  }

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
