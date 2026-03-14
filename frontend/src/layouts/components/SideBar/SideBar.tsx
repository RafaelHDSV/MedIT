import { useAuth } from '@/hooks/useAuth'
import { Roles } from '@/interfaces/IUser'
import { ROUTES } from '@/routes/constants'
import routes, { type IRoute, type IRouteGroup } from '@/routes/routes'
import { CaretDownIcon, CaretUpIcon, ListIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Logo from '../Logo/Logo'
import ProgressTag from './components/ProgressTag/ProgressTag'
import UserTag from './components/UserTag/UserTag'
import styles from './SideBar.module.scss'

function SidebarItems() {
  const { user } = useAuth()
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({})

  const toggleGroup = (groupName: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName]
    }))
  }

  const renderRoute = (route: IRoute) => {
    if (route.meta?.hidden) return null

    return (
      <li key={route.path}>
        <NavLink
          to={route.path}
          className={({ isActive }) => {
            const baseClass =
              isActive || location.pathname === route.path
                ? styles.activeLink
                : styles.link

            const groupClass = route.meta?.group ? styles.linkGroup : ''

            return `${baseClass} ${groupClass}`
          }}
          end={route.path === ROUTES.DASHBOARD.path}
        >
          <div className={styles.linkContent}>
            {route.icon && <route.icon size={22} className={styles.linkIcon} />}
            {route.name}
          </div>

          {user?.role === Roles.ADMIN && (
            <ProgressTag status={route.meta?.progress} />
          )}
        </NavLink>
      </li>
    )
  }

  const groupedRoutes = routes.reduce<{
    noGroup: IRoute[]
    groups: Record<string, { group: IRouteGroup; routes: IRoute[] }>
  }>(
    (acc, route) => {
      if (route.meta?.hidden) return acc

      const group = route.meta?.group

      if (!group) {
        acc.noGroup.push(route)
        return acc
      }

      if (!acc.groups[group.name]) {
        acc.groups[group.name] = {
          group,
          routes: []
        }
      }

      acc.groups[group.name].routes.push(route)

      return acc
    },
    {
      noGroup: [],
      groups: {}
    }
  )

  const renderGroup = (
    groupName: string,
    groupData: { group: IRouteGroup; routes: IRoute[] }
  ) => {
    const isOpen = openGroups[groupName] || false

    return (
      <li key={groupName}>
        <div className={styles.link} onClick={() => toggleGroup(groupName)}>
          <div className={styles.linkContent}>
            {groupData.group.icon && (
              <groupData.group.icon size={20} className={styles.linkIcon} />
            )}

            <span>{groupName}</span>
          </div>

          {isOpen ? <CaretUpIcon size={22} /> : <CaretDownIcon size={22} />}
        </div>

        {isOpen && (
          <ul className={styles.groupList}>
            {groupData.routes.map(renderRoute)}
          </ul>
        )}
      </li>
    )
  }

  return (
    <ul className={styles.menuList}>
      {groupedRoutes.noGroup.map(renderRoute)}

      {Object.entries(groupedRoutes.groups).map(([groupName, groupData]) =>
        renderGroup(groupName, groupData)
      )}
    </ul>
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

      <UserTag />
    </nav>
  )
}

export default SideBar
