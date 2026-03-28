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
  meta: { hidden: true }
}

const signUp: IRoute = {
  name: ROUTES.SIGNUP.name,
  description: ROUTES.SIGNUP.description,
  path: ROUTES.SIGNUP.path,
  meta: { hidden: true }
}

const dashboard: IRoute = {
  name: ROUTES.DASHBOARD.name,
  description: ROUTES.DASHBOARD.description,
  path: ROUTES.DASHBOARD.path,
  icon: ChartBarIcon,
  meta: {
    hidden: false,
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
    levels: [UserLevels.ADMIN]
  }
}

const doctorDetails: IRoute = {
  name: ROUTES.DOCTORS_DETAILS.name,
  description: ROUTES.DOCTORS_DETAILS.description,
  path: ROUTES.DOCTORS_DETAILS.path,
  meta: {
    hidden: true,
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
    levels: [UserLevels.ADMIN]
  }
}

const nurseDetails: IRoute = {
  name: ROUTES.NURSES_DETAILS.name,
  description: ROUTES.NURSES_DETAILS.description,
  path: ROUTES.NURSES_DETAILS.path,
  meta: {
    hidden: true,
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
    levels: [UserLevels.ADMIN, UserLevels.DOCTOR, UserLevels.NURSE]
  }
}

const patientDetails: IRoute = {
  name: ROUTES.PATIENTS_DETAILS.name,
  description: ROUTES.PATIENTS_DETAILS.description,
  path: ROUTES.PATIENTS_DETAILS.path,
  meta: {
    hidden: true,
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
    levels: [UserLevels.NURSE]
  }
}

const triagesDetails: IRoute = {
  name: ROUTES.TRIAGES_DETAILS.name,
  description: ROUTES.TRIAGES_DETAILS.description,
  path: ROUTES.TRIAGES_DETAILS.path,
  meta: {
    hidden: true,
    levels: [UserLevels.NURSE],
    canGoBack: true
  }
}

const routes: IRoute[] = [
  signIn,
  signUp,
  dashboard,
  attendances,
  triages,
  triagesDetails,
  doctors,
  doctorDetails,
  nurses,
  nurseDetails,
  patients,
  patientDetails,
  medications
]

export default routes
