import { lazy } from 'react'

// LAYOUTS
export const AppLayout = lazy(() => import('../layouts/AppLayout'))
export const NotFound = lazy(() => import('../pages/NotFound/NotFound'))

// UNAUTH PAGES
export const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
export const SignInJOTA = lazy(() => import('../pages/SignInJOTA/SignIn'))
export const SignUp = lazy(() => import('../pages/SignUp/SignUp'))
export const SignUpJOTA = lazy(() => import('../pages/SignUpJOTA/SignUp'))

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
