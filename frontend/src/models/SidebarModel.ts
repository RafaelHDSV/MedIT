import type { Roles } from '@/interfaces/IUser'

const SidebarModel = {
  hasAcessByLevel: (routeLevel?: Roles[], userLevel?: Roles) => {
    if (!routeLevel) return true
    if (!userLevel) return false
    return routeLevel.includes(userLevel)
  }
}

export default SidebarModel
