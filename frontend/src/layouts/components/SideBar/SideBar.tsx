import { ListIcon, SignOutIcon } from '@phosphor-icons/react'
import Logo from '../Logo/Logo'
import styles from './SideBar.module.scss'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/constants'
import routes from '@/routes/routes'
import { useAuth } from '@/hooks/useAuth'
import { UserRoles } from '@/interfaces/IUser'
import { stringToColor } from '@/utils/stringToColor'
import { getContrastColor } from '@/utils/getContrastColor'
import { getInitials } from '@/utils/getInitials'

function SidebarItems() {
  const location = useLocation()

  return (
    <ul className={styles.menuList}>
      {routes
        .filter((route) => route.authed)
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
            </NavLink>
          </li>
        ))}
    </ul>
  )
}

function User() {
  const { user, logout } = useAuth()
  const bgColor = stringToColor(user?.shortName ?? '')
  const textColor = getContrastColor(bgColor)
  const initials = getInitials(user?.shortName ?? '')

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
          <strong>{user?.shortName}</strong>
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
