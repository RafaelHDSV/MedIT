import type { UserRoles } from '@/interfaces/IUser'

const SidebarModel = {
  hasAcessByLevel: (routeLevel?: UserRoles[], userLevel?: UserRoles) => {
    if (!routeLevel) return true
    if (!userLevel) return false
    return routeLevel.includes(userLevel)
  }
}

export default SidebarModel
