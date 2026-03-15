import { lazy } from 'react'

// LAYOUTS
export const AppLayout = lazy(() => import('../layouts/AppLayout'))
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
export const Nurse = lazy(() => import('../pages/Nurse/Nurse'))
export const Patients = lazy(() => import('../pages/Patients/Patients'))
export const Medications = lazy(
  () => import('../pages/Medications/Medications')
)
export const Attendances = lazy(
  () => import('../pages/Attendances/Attendances')
)
export const Triages = lazy(() => import('../pages/Triages/Triages'))
