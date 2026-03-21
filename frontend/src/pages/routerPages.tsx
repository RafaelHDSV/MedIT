import { lazy } from 'react'

// LAYOUTS
export const AuthLayout = lazy(() => import('../layouts/AuthLayout/AuthLayout'))
export const UnauthLayout = lazy(
  () => import('../layouts/UnauthLayout/UnauthLayout')
)
export const NotFound = lazy(() => import('../pages/NotFound/NotFound'))

// UNAUTH PAGES
export const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
export const SignUp = lazy(() => import('../pages/SignUp/SignUp'))

// AUTH PAGES
export const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'))
export const Doctors = lazy(() => import('../pages/Doctors/Doctors'))
export const DoctorDetails = lazy(
  () => import('../pages/DoctorDetails/DoctorDetails')
)
export const Nurses = lazy(() => import('../pages/Nurses/Nurses'))
export const NursesDetails = lazy(
  () => import('../pages/NursesDetails/NursesDetails')
)
export const Patients = lazy(() => import('../pages/Patients/Patients'))
export const PatientsDetails = lazy(
  () => import('../pages/PatientsDetails/PatientsDetails')
)
export const Medications = lazy(
  () => import('../pages/Medications/Medications')
)
export const Attendances = lazy(
  () => import('../pages/Attendances/Attendances')
)
export const Triages = lazy(() => import('../pages/Triages/Triages'))
export const TriagesDetails = lazy(
  () => import('../pages/TriagesDetails/TriagesDetails')
)
