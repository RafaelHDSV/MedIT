import { ListIcon } from '@phosphor-icons/react'
import Logo from '../Logo/Logo'
import styles from './SideBar.module.scss'
import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/constants'
import routes from '@/routes/routes'

function SideBar() {
  const location = useLocation()

  return (
    <nav className={styles.nav}>
      <header className={styles.header}>
        <ListIcon className={styles.icon} size={32} />
        <Logo fontSize={32} />
      </header>

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
                {route.name}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  )
}

export default SideBar
