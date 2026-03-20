import type { UserLevels } from '@/interfaces/IUser'

const SidebarModel = {
  hasAcessByLevel: (routeLevel?: UserLevels[], userLevel?: UserLevels) => {
    if (!routeLevel) return true
    if (!userLevel) return false
    return routeLevel.includes(userLevel)
  }
}

export default SidebarModel
