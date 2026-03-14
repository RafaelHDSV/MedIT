import { ListIcon, SignOutIcon } from '@phosphor-icons/react'
import Logo from '../Logo/Logo'
import styles from './SideBar.module.scss'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/constants'
import routes, { type IRoute } from '@/routes/routes'
import { useAuth } from '@/hooks/useAuth'
import { Roles, UserRoles } from '@/interfaces/IUser'
import { stringToColor } from '@/utils/stringToColor'
import { getContrastColor } from '@/utils/getContrastColor'
import { getInitials } from '@/utils/getInitials'
import getShortName from '@/utils/getShortName'
import { Tag } from 'antd'

function SidebarItems() {
  const { user } = useAuth()
  const location = useLocation()

  const getProgressStatus = (route: IRoute) => {
    switch (route.meta?.progress) {
      case 'not_started':
        return <Tag color='red'>Não iniciado</Tag>
      case 'in_progress':
        return <Tag color='blue'>Em progresso</Tag>
      case 'completed':
        return <Tag color='green'>Concluído</Tag>
      default:
        return <Tag color='red'>Não iniciado</Tag>
    }
  }

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
              {route.icon && (
                <route.icon size={26} className={styles.linkIcon} />
              )}
              {route.name}
              {user?.role === Roles.ADMIN && getProgressStatus(route)}
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

      <SignOutIcon className={styles.icon} size={24} />
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
