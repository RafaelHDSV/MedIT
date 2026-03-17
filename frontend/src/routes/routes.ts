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
import { UserRoles } from '../interfaces/IUser'
import { ROUTE_GROUP, ROUTES } from './constants'

export interface IRouteGroup {
  name: string
  icon?: Icon
}

interface MetaConfiguration {
  group?: IRouteGroup
  hidden?: boolean
  progress?: ProgressStatus
  levels?: UserRoles[]
  canGoBack?: boolean
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
    levels: [
      UserRoles.ADMIN,
      UserRoles.DOCTOR,
      UserRoles.NURSE,
      UserRoles.PATIENT
    ]
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
    levels: [UserRoles.ADMIN]
  }
}

const doctorDetails: IRoute = {
  name: ROUTES.DOCTORS_DETAILS.name,
  path: ROUTES.DOCTORS_DETAILS.path,
  meta: {
    hidden: true,
    progress: ProgressStatus.IN_PROGRESS,
    levels: [UserRoles.ADMIN],
    canGoBack: true
  }
}

const nurses: IRoute = {
  name: ROUTES.NURSES.name,
  path: ROUTES.NURSES.path,
  icon: StethoscopeIcon,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserRoles.ADMIN]
  }
}

const nurseDetails: IRoute = {
  name: ROUTES.NURSES_DETAILS.name,
  path: ROUTES.NURSES_DETAILS.path,
  meta: {
    hidden: true,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserRoles.ADMIN],
    canGoBack: true
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
    levels: [UserRoles.ADMIN, UserRoles.DOCTOR, UserRoles.NURSE]
  }
}

const patientDetails: IRoute = {
  name: ROUTES.PATIENTS_DETAILS.name,
  path: ROUTES.PATIENTS_DETAILS.path,
  meta: {
    hidden: true,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserRoles.ADMIN, UserRoles.DOCTOR, UserRoles.NURSE],
    canGoBack: true
  }
}

const medications: IRoute = {
  name: ROUTES.MEDICAMENTS.name,
  path: ROUTES.MEDICAMENTS.path,
  icon: PillIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [
      UserRoles.ADMIN,
      UserRoles.DOCTOR,
      UserRoles.NURSE,
      UserRoles.PATIENT
    ]
  }
}

const attendances: IRoute = {
  name: ROUTES.ATTENDANCES.name,
  path: ROUTES.ATTENDANCES.path,
  icon: CalendarDotsIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserRoles.DOCTOR]
  }
}

const triages: IRoute = {
  name: ROUTES.TRIAGES.name,
  path: ROUTES.TRIAGES.path,
  icon: CalendarDotsIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserRoles.NURSE]
  }
}

const routes: IRoute[] = [
  signIn,
  signUp,
  dashboard,
  attendances,
  triages,
  doctors,
  doctorDetails,
  nurses,
  nurseDetails,
  patients,
  patientDetails,
  medications
]

export default routes
