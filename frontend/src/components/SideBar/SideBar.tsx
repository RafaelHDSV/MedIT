import { useAuth } from '@/hooks/useAuth'
import SidebarModel from '@/models/SidebarModel'
import { ROUTES } from '@/routes/constants'
import routes, { type IRoute } from '@/routes/routes'
import { CaretDownIcon, CaretUpIcon, ListIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from '../Logo/Logo'
import ProgressTag from '../ProgressTag/ProgressTag'
import ConfigTag from './components/ConfigTag/ConfigTag'
import UserTag from './components/UserTag/UserTag'
import styles from './SideBar.module.scss'

const INITIAL_GROUPS_STATE = { Usuários: true }

interface ISidebarItemsProps {
  isCompact: boolean
}

function SidebarItems({ isCompact }: ISidebarItemsProps) {
  const { user } = useAuth()
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>(
    INITIAL_GROUPS_STATE
  )

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const renderedGroups = new Set<string>()

  const renderRoute = (route: IRoute) => {
    const hasAcessByLevel = SidebarModel.hasAcessByLevel(
      route.meta?.levels,
      user?.role
    )
    if (route.meta?.hidden || !hasAcessByLevel) return null

    if (route.meta?.group && !isCompact) {
      const groupName = route.meta.group.name
      if (renderedGroups.has(groupName)) return null
      renderedGroups.add(groupName)

      const groupRoutes = routes.filter(
        (r) =>
          r.meta?.group?.name === groupName &&
          !r.meta?.hidden &&
          SidebarModel.hasAcessByLevel(r.meta?.levels, user?.role)
      )
      if (!groupRoutes.length) return null

      const isOpen = openGroups[groupName] || false
      return (
        <li key={groupName}>
          <div className={styles.link} onClick={() => toggleGroup(groupName)}>
            <div className={styles.linkContent}>
              {route.meta.group.icon && (
                <route.meta.group.icon size={20} className={styles.linkIcon} />
              )}
              <span>{groupName}</span>
            </div>
            {isOpen ? <CaretUpIcon size={20} /> : <CaretDownIcon size={20} />}
          </div>
          {isOpen && (
            <ul className={styles.groupList}>
              {groupRoutes.map((r) => (
                <li key={r.path}>
                  <NavLink
                    to={r.path}
                    className={({ isActive }) => {
                      const baseClass =
                        isActive || location.pathname === r.path
                          ? styles.activeLink
                          : styles.link
                      const groupClass = styles.linkGroup
                      return `${baseClass} ${groupClass}`
                    }}
                    end={r.path === ROUTES.DASHBOARD.path}
                  >
                    <div className={styles.linkContent}>
                      {r.icon && (
                        <r.icon size={22} className={styles.linkIcon} />
                      )}
                      {!isCompact ? r.name : ''}
                    </div>

                    <ProgressTag status={r.meta?.progress} />
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      )
    }

    return (
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
            {route.icon && <route.icon size={22} className={styles.linkIcon} />}
            {!isCompact ? route.name : ''}
          </div>

          <ProgressTag status={route.meta?.progress} />
        </NavLink>
      </li>
    )
  }

  return <ul className={styles.menuList}>{routes.map(renderRoute)}</ul>
}

function SideBar() {
  const [isCompact, setIsCompact] = useState(false)

  return (
    <nav className={`${styles.nav} ${isCompact ? styles.compact : ''}`}>
      <div className={styles.main}>
        <header className={styles.header}>
          <ListIcon
            className={styles.icon}
            size={32}
            onClick={() => setIsCompact(!isCompact)}
          />
          <Logo fontSize={32} isCompact={isCompact} />
        </header>

        <SidebarItems isCompact={isCompact} />
      </div>

      <div className={styles.footer}>
        <ConfigTag isCompact={isCompact} />
        <UserTag isCompact={isCompact} />
      </div>
    </nav>
  )
}

export default SideBar
