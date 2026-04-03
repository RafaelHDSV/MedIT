import { getContrastColor } from '@/utils/getContrastColor'
import { getInitials } from '@/utils/getInitials'
import { stringToColor } from '@/utils/stringToColor'
import { Skeleton } from 'antd'
import styles from './UserBall.module.scss'

interface IUserBallProps {
  name?: string
  size?: number
  fontSize?: number
  loading?: boolean
}

function UserBall({
  name,
  size = 40,
  fontSize = 14,
  loading = false
}: IUserBallProps) {
  if (!name) return
  
  const bgColor = stringToColor(name)
  const textColor = getContrastColor(bgColor)
  const initials = getInitials(name)

  if (loading) {
    return <Skeleton.Avatar active size={size} shape='circle' />
  }

  return (
    <div
      className={styles.avatar}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        width: size,
        height: size,
        fontSize: fontSize
      }}
    >
      {initials}
    </div>
  )
}

export default UserBall
