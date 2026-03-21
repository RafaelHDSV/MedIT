import UserBall from '@/components/UserBall/UserBall'
import { useAuth } from '@/hooks/useAuth'
import { UserLevelsLabels } from '@/interfaces/IUser'
import getShortName from '@/utils/getShortName'
import { SignOutIcon } from '@phosphor-icons/react'
import styles from './UserTag.module.scss'

interface IUserTagProps {
  isCompact: boolean
}

function UserTag({ isCompact }: IUserTagProps) {
  const { user, logout } = useAuth()
  const shortName = getShortName(user?.name)

  return (
    <button
      className={`${styles.user} ${isCompact ? styles.compact : ''}`}
      onClick={logout}
    >
      {!isCompact ? (
        <div className={styles.userContent}>
          <UserBall name={shortName} />

          <div className={styles.userInfo}>
            <strong>{shortName}</strong>
            {user?.level && <p>{UserLevelsLabels[user.level]}</p>}
          </div>
        </div>
      ) : (
        <></>
      )}

      <SignOutIcon className={styles.icon} size={22} />
    </button>
  )
}

export default UserTag
