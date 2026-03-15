import { ProgressStatus } from '@/components/ProgressTag/ProgressTag'
import {
  AmbulanceIcon,
  CalendarDotsIcon,
  ChartBarIcon,
  FirstAidIcon,
  PillIcon,
  StethoscopeIcon,
  type Icon
} from '@phosphor-icons/react'
import { Roles } from '../interfaces/IUser'
import { ROUTE_GROUP, ROUTES } from './constants'

export interface IRouteGroup {
  name: string
  icon?: Icon
}

interface MetaConfiguration {
  group?: IRouteGroup
  hidden?: boolean
  progress?: ProgressStatus
  levels?: Roles[]
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
  icon: ChartBarIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.PATIENT]
  }
}

const doctors: IRoute = {
  name: ROUTES.DOCTORS.name,
  path: ROUTES.DOCTORS.path,
  icon: AmbulanceIcon,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.IN_PROGRESS,
    levels: [Roles.ADMIN]
  }
}

const nurses: IRoute = {
  name: ROUTES.NURSE.name,
  path: ROUTES.NURSE.path,
  icon: StethoscopeIcon,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [Roles.ADMIN]
  }
}

const patients: IRoute = {
  name: ROUTES.PATIENTS.name,
  path: ROUTES.PATIENTS.path,
  icon: FirstAidIcon,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE]
  }
}

const medications: IRoute = {
  name: ROUTES.MEDICAMENTS.name,
  path: ROUTES.MEDICAMENTS.path,
  icon: PillIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.PATIENT]
  }
}

const attendances: IRoute = {
  name: ROUTES.ATTENDANCES.name,
  path: ROUTES.ATTENDANCES.path,
  icon: CalendarDotsIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [Roles.DOCTOR]
  }
}

const triages: IRoute = {
  name: ROUTES.TRIAGES.name,
  path: ROUTES.TRIAGES.path,
  icon: CalendarDotsIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [Roles.NURSE]
  }
}

const routes: IRoute[] = [
  signIn,
  signUp,
  dashboard,
  attendances,
  triages,
  doctors,
  nurses,
  patients,
  medications
]

export default routes
