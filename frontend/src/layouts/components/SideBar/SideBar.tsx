import {
  CheckIcon,
  HourglassMediumIcon,
  ListIcon,
  SignOutIcon,
  XIcon
} from '@phosphor-icons/react'
import Logo from '../Logo/Logo'
import styles from './SideBar.module.scss'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/constants'
import routes, { type ProgressStatus } from '@/routes/routes'
import { useAuth } from '@/hooks/useAuth'
import { Roles, UserRoles } from '@/interfaces/IUser'
import { stringToColor } from '@/utils/stringToColor'
import { getContrastColor } from '@/utils/getContrastColor'
import { getInitials } from '@/utils/getInitials'
import getShortName from '@/utils/getShortName'
import { Tag, Tooltip } from 'antd'
import { useMemo } from 'react'

interface IProgressTagProps {
  status?: ProgressStatus
}
function ProgressTag({ status }: IProgressTagProps) {
  const { tooltip, color, icon } = useMemo(() => {
    const unknownState = {
      tooltip: 'Desconhecido',
      color: 'red',
      icon: <XIcon />
    }
    if (!status) return unknownState

    switch (status) {
      case 'not_started':
        return { tooltip: 'Não iniciado', color: 'red', icon: <XIcon /> }
      case 'in_progress':
        return {
          tooltip: 'Em andamento',
          color: 'blue',
          icon: <HourglassMediumIcon />
        }
      case 'completed':
        return { tooltip: 'Concluído', color: 'green', icon: <CheckIcon /> }
      default:
        return unknownState
    }
  }, [status])

  return (
    <Tooltip title={tooltip}>
      <Tag color={color}>{icon}</Tag>
    </Tooltip>
  )
}

function SidebarItems() {
  const { user } = useAuth()
  const location = useLocation()

  return (
    <ul className={styles.menuList}>
      {routes
        .filter((route) => route.meta?.hidden !== true)
        .map((route) => (
          <li key={route.path}>
            <NavLink
              to={route.path}
              className={({ isActive }) =>
                isActive || location.pathname === route.path
                  ? styles.activeLink
                  : styles.link
              }
              end={route.path === ROUTES.DASHBOARD.path}
            >
              <div className={styles.linkContent}>
                {route.icon && (
                  <route.icon size={22} className={styles.linkIcon} />
                )}
                {route.name}
              </div>
              {user?.role === Roles.ADMIN && (
                <ProgressTag status={route.meta?.progress} />
              )}
            </NavLink>
          </li>
        ))}
    </ul>
  )
}

function User() {
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

function SideBar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.main}>
        <header className={styles.header}>
          <ListIcon className={styles.icon} size={32} />
          <Logo fontSize={32} />
        </header>

        <SidebarItems />
      </div>

      <User />
    </nav>
  )
}

export default SideBar
