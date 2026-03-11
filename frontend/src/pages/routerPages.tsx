import { lazy } from 'react'

export const AppLayout = lazy(() => import('../layouts/AppLayout'))
export const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'))
export const ExampleTable = lazy(
  () => import('../pages/ExampleTable/ExampleTable')
)
export const SignIn = lazy(() => import('../pages/SignIn/SignIn'))
export const SignUp = lazy(() => import('../pages/SignUp/SignUp'))
export const NotFound = lazy(() => import('../pages/NotFound/NotFound'))
