import { ListIcon } from '@phosphor-icons/react'
import Logo from '../Logo/Logo'
import styles from './SideBar.module.scss'
import { NavLink } from 'react-router-dom'
import routes from '@/routes/routes'
import { ROUTES } from '@/routes/constants'

function SideBar() {
  return (
    <nav className={styles.nav}>
      <header className={styles.header}>
        <ListIcon className={styles.icon} size={32} />
        <Logo fontSize={32} />
      </header>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {routes.map((route) => (
          <li key={route.path} style={{ margin: '1rem 0' }}>
            <NavLink
              to={route.path}
              style={({ isActive }) => ({
                color: isActive ? 'var(--primary-color)' : 'inherit',
                textDecoration: 'none',
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '1.1rem'
              })}
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
