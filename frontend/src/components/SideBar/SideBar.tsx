import { useAuth } from '@/hooks/useAuth'
import SidebarModel from '@/models/SidebarModel'
import { ROUTES } from '@/routes/constants'
import routes, { type IRoute } from '@/routes/routes'
import { CaretDownIcon, CaretUpIcon, ListIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { matchPath, NavLink, useLocation } from 'react-router-dom'
import Logo from '../Logo/Logo'
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
      user?.level
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
          SidebarModel.hasAcessByLevel(r.meta?.levels, user?.level)
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
          className={({ isActive }) => {
            const isActiveWithParamsValidation = !!matchPath(
              { path: route.path, end: true },
              location.pathname
            )

            return isActive || isActiveWithParamsValidation
              ? styles.activeLink
              : styles.link
          }}
          end={route.path === ROUTES.DASHBOARD.path}
        >
          <div className={styles.linkContent}>
            {route.icon && <route.icon size={22} className={styles.linkIcon} />}
            {!isCompact ? route.name : ''}
          </div>
        </NavLink>
      </li>
    )
  }

  return <ul className={styles.menuList}>{routes?.map(renderRoute)}</ul>
}

interface ISideBarProps {
  isMobile?: boolean
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

function SideBar({
  isMobile = false,
  mobileOpen = false,
  onMobileOpenChange
}: ISideBarProps) {
  const [isCompact, setIsCompact] = useState(false)
  const effectiveCompact = isMobile ? false : isCompact

  const toggleMenu = () => {
    if (isMobile) {
      onMobileOpenChange?.(!mobileOpen)
    } else {
      setIsCompact((prev) => !prev)
    }
  }

  const iconActive = (!isMobile && isCompact) || (isMobile && mobileOpen)
  const mobileHidden = isMobile && !mobileOpen

  return (
    <nav
      className={`${styles.nav} ${effectiveCompact ? styles.compact : ''} ${mobileHidden ? styles.mobileHidden : ''}`}
    >
      <div className={styles.main}>
        <header className={styles.header}>
          <ListIcon
            className={`${styles.icon} ${iconActive ? styles.iconActive : ''}`}
            size={32}
            onClick={toggleMenu}
          />
          <Logo fontSize={32} isCompact={effectiveCompact} />
        </header>

        <SidebarItems isCompact={effectiveCompact} />
      </div>

      <div className={styles.footer}>
        <ConfigTag isCompact={effectiveCompact} />
        <UserTag isCompact={effectiveCompact} />
      </div>
    </nav>
  )
}

export default SideBar
