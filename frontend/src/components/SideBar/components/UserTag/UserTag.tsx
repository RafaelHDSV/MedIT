import UserBall from '@/components/UserBall/UserBall'
import { useAuth } from '@/hooks/useAuth'
import { UserLevelsLabels } from '@/interfaces/IUser'
import { getContrastColor } from '@/utils/getContrastColor'
import getShortName from '@/utils/getShortName'
import { stringToColor } from '@/utils/stringToColor'
import { SignOutIcon } from '@phosphor-icons/react'
import { Tooltip } from 'antd'
import styles from './UserTag.module.scss'

interface IUserTagProps {
  isCompact: boolean
}

function UserTag({ isCompact }: IUserTagProps) {
  const { user, logout } = useAuth()
  const shortName = getShortName(user?.name)
  const bgColor = stringToColor(shortName)
  const textColor = getContrastColor(bgColor)

  return (
    <Tooltip title={isCompact ? 'Sair da conta' : ''} placement='right'>
      <button
        className={`${styles.user} ${isCompact ? styles.compact : ''}`}
        onClick={() => logout()}
      >
        {!isCompact ? (
          <div className={styles.userContent}>
            <UserBall name={shortName} />

            <div className={styles.userInfo}>
              <Tooltip
                title={user?.name}
                color={bgColor}
                styles={{
                  container: {
                    color: textColor
                  }
                }}
              >
                <strong className='ellipsis'>{shortName}</strong>
              </Tooltip>
              {user?.level && <p>{UserLevelsLabels[user.level]}</p>}
            </div>
          </div>
        ) : (
          <></>
        )}

        <SignOutIcon className={styles.icon} size={22} />
      </button>
    </Tooltip>
  )
}

export default UserTag
