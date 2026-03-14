import { ChartBarIcon, type Icon } from '@phosphor-icons/react'
import { ROUTES } from './constants'

const ProgressStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const
export type ProgressStatus =
  (typeof ProgressStatus)[keyof typeof ProgressStatus]

interface MetaConfiguration {
  hidden?: boolean
  progress?: ProgressStatus
}

export interface IRoute {
  name: string
  path: string
  icon?: Icon
  meta?: MetaConfiguration
}

const signIn: IRoute = {
  name: ROUTES.SIGNIN.name,
  path: ROUTES.SIGNIN.path,
  meta: { hidden: true, progress: ProgressStatus.IN_PROGRESS }
}

const signUp: IRoute = {
  name: ROUTES.SIGNUP.name,
  path: ROUTES.SIGNUP.path,
  meta: { hidden: true, progress: ProgressStatus.IN_PROGRESS }
}

const dashboard: IRoute = {
  name: ROUTES.DASHBOARD.name,
  path: ROUTES.DASHBOARD.path,
  meta: { hidden: false, progress: ProgressStatus.NOT_STARTED },
  icon: ChartBarIcon
}

const routes: IRoute[] = [signIn, signUp, dashboard]

export default routes
