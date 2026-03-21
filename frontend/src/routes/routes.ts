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
import { UserLevels } from '../interfaces/IUser'
import { ROUTE_GROUP, ROUTES } from './constants'

export interface IRouteGroup {
  name: string
  icon?: Icon
}

interface MetaConfiguration {
  group?: IRouteGroup
  hidden?: boolean
  progress?: ProgressStatus
  levels?: UserLevels[]
  canGoBack?: boolean
}

export interface IRoute {
  name: string
  description?: string
  path: string
  icon?: Icon
  meta?: MetaConfiguration
}

const signIn: IRoute = {
  name: ROUTES.SIGNIN.name,
  description: ROUTES.SIGNIN.description,
  path: ROUTES.SIGNIN.path,
  meta: { hidden: true, progress: ProgressStatus.IN_PROGRESS }
}

const signUp: IRoute = {
  name: ROUTES.SIGNUP.name,
  description: ROUTES.SIGNUP.description,
  path: ROUTES.SIGNUP.path,
  meta: { hidden: true, progress: ProgressStatus.IN_PROGRESS }
}

const dashboard: IRoute = {
  name: ROUTES.DASHBOARD.name,
  description: ROUTES.DASHBOARD.description,
  path: ROUTES.DASHBOARD.path,
  icon: ChartBarIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [
      UserLevels.ADMIN,
      UserLevels.DOCTOR,
      UserLevels.NURSE,
      UserLevels.PATIENT
    ]
  }
}

const doctors: IRoute = {
  name: ROUTES.DOCTORS.name,
  description: ROUTES.DOCTORS.description,
  path: ROUTES.DOCTORS.path,
  icon: AmbulanceIcon,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.COMPLETED,
    levels: [UserLevels.ADMIN]
  }
}

const doctorDetails: IRoute = {
  name: ROUTES.DOCTORS_DETAILS.name,
  description: ROUTES.DOCTORS_DETAILS.description,
  path: ROUTES.DOCTORS_DETAILS.path,
  meta: {
    hidden: true,
    progress: ProgressStatus.IN_PROGRESS,
    levels: [UserLevels.ADMIN],
    canGoBack: true
  }
}

const nurses: IRoute = {
  name: ROUTES.NURSES.name,
  description: ROUTES.NURSES.description,
  path: ROUTES.NURSES.path,
  icon: StethoscopeIcon,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.IN_PROGRESS,
    levels: [UserLevels.ADMIN]
  }
}

const nurseDetails: IRoute = {
  name: ROUTES.NURSES_DETAILS.name,
  description: ROUTES.NURSES_DETAILS.description,
  path: ROUTES.NURSES_DETAILS.path,
  meta: {
    hidden: true,
    progress: ProgressStatus.COMPLETED,
    levels: [UserLevels.ADMIN],
    canGoBack: true
  }
}

const patients: IRoute = {
  name: ROUTES.PATIENTS.name,
  description: ROUTES.PATIENTS.description,
  path: ROUTES.PATIENTS.path,
  icon: FirstAidIcon,
  meta: {
    group: ROUTE_GROUP.USERS,
    hidden: false,
    progress: ProgressStatus.IN_PROGRESS,
    levels: [UserLevels.ADMIN, UserLevels.DOCTOR, UserLevels.NURSE]
  }
}

const patientDetails: IRoute = {
  name: ROUTES.PATIENTS_DETAILS.name,
  description: ROUTES.PATIENTS_DETAILS.description,
  path: ROUTES.PATIENTS_DETAILS.path,
  meta: {
    hidden: true,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserLevels.ADMIN, UserLevels.DOCTOR, UserLevels.NURSE],
    canGoBack: true
  }
}

const medications: IRoute = {
  name: ROUTES.MEDICAMENTS.name,
  description: ROUTES.MEDICAMENTS.description,
  path: ROUTES.MEDICAMENTS.path,
  icon: PillIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [
      UserLevels.ADMIN,
      UserLevels.DOCTOR,
      UserLevels.NURSE,
      UserLevels.PATIENT
    ]
  }
}

const attendances: IRoute = {
  name: ROUTES.ATTENDANCES.name,
  description: ROUTES.ATTENDANCES.description,
  path: ROUTES.ATTENDANCES.path,
  icon: CalendarDotsIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserLevels.DOCTOR]
  }
}

const triages: IRoute = {
  name: ROUTES.TRIAGES.name,
  description: ROUTES.TRIAGES.description,
  path: ROUTES.TRIAGES.path,
  icon: CalendarDotsIcon,
  meta: {
    hidden: false,
    progress: ProgressStatus.NOT_STARTED,
    levels: [UserLevels.NURSE]
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
