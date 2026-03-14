import {
  AmbulanceIcon,
  ChartBarIcon,
  FirstAidIcon,
  PillIcon,
  StethoscopeIcon,
  type Icon
} from '@phosphor-icons/react'
import { ROUTE_GROUP, ROUTES } from './constants'

const ProgressStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const
export type ProgressStatus =
  (typeof ProgressStatus)[keyof typeof ProgressStatus]

export interface IRouteGroup {
  name: string
  icon?: Icon
}

interface MetaConfiguration {
  group?: IRouteGroup
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

const doctors: IRoute = {
  name: ROUTES.DOCTORS.name,
  path: ROUTES.DOCTORS.path,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.IN_PROGRESS
  },
  icon: AmbulanceIcon
}

const nurses: IRoute = {
  name: ROUTES.NURSE.name,
  path: ROUTES.NURSE.path,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.NOT_STARTED
  },
  icon: StethoscopeIcon
}

const patients: IRoute = {
  name: ROUTES.PATIENTS.name,
  path: ROUTES.PATIENTS.path,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.NOT_STARTED
  },
  icon: FirstAidIcon
}

const medications: IRoute = {
  name: ROUTES.MEDICAMENTS.name,
  path: ROUTES.MEDICAMENTS.path,
  meta: { hidden: false, progress: ProgressStatus.NOT_STARTED },
  icon: PillIcon
}

const routes: IRoute[] = [
  signIn,
  signUp,
  dashboard,
  doctors,
  nurses,
  patients,
  medications
]

export default routes
