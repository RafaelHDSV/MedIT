import { useAuth } from '@/hooks/useAuth'
import { UserRoles } from '@/interfaces/IUser'
import { getContrastColor } from '@/utils/getContrastColor'
import { getInitials } from '@/utils/getInitials'
import getShortName from '@/utils/getShortName'
import { stringToColor } from '@/utils/stringToColor'
import { SignOutIcon } from '@phosphor-icons/react'
import styles from './UserTag.module.scss'

interface IUserTagProps {
  isCompact: boolean
}

function UserTag({ isCompact }: IUserTagProps) {
  const { user, logout } = useAuth()
  const shortName = getShortName(user?.name)
  const bgColor = stringToColor(shortName)
  const textColor = getContrastColor(bgColor)
  const initials = getInitials(shortName)

  return (
    <button
      className={`${styles.user} ${isCompact ? styles.compact : ''}`}
      onClick={logout}
    >
      {!isCompact ? (
        <div className={styles.userContent}>
          <div
            className={styles.avatar}
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            {initials}
          </div>

          <div className={styles.userInfo}>
            <strong>{shortName}</strong>
            {user?.role && <p>{UserRoles[user.role]}</p>}
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
