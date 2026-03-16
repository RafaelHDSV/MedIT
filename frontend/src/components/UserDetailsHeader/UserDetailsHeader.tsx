import { UserGender, UserGendersLabels } from '@/interfaces/IUser'
import Tag, { TagStatuses } from '../Tag/Tag'
import UserBall from '../UserBall/UserBall'
import styles from './UserDetailsHeader.module.scss'

interface IUserDetailsHeaderProps {
  name: string
  age: number
  gender?: UserGender
  statusTag?: TagStatuses
  statusTagText?: string
}

function UserDetailsHeader({
  name,
  age,
  gender,
  statusTag,
  statusTagText
}: IUserDetailsHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <UserBall name={name} size={64} fontSize={26} />

        <div className={styles.doctorInfo}>
          <h2>{name}</h2>

          <p>
            <span>{age} anos</span>
            <span className={styles.separator}>•</span>
            <span>{gender && UserGendersLabels[gender]}</span>
          </p>
        </div>
      </div>

      {statusTag && statusTagText && (
        <Tag status={statusTag}>{statusTagText}</Tag>
      )}
    </header>
  )
}

export default UserDetailsHeader
