import { useAuth } from '@/hooks/useAuth'
import { getContrastColor } from '@/utils/getContrastColor'
import { getInitials } from '@/utils/getInitials'
import getShortName from '@/utils/getShortName'
import { stringToColor } from '@/utils/stringToColor'
import { SignOutIcon } from '@phosphor-icons/react'
import styles from './UserTag.module.scss'
import { UserRoles } from '@/interfaces/IUser'

function UserTag() {
  const { user, logout } = useAuth()
  const shortName = getShortName(user?.name)
  const bgColor = stringToColor(shortName)
  const textColor = getContrastColor(bgColor)
  const initials = getInitials(shortName)

  return (
    <button className={styles.user} onClick={logout}>
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

      <SignOutIcon className={styles.icon} size={22} />
    </button>
  )
}

export default UserTag
