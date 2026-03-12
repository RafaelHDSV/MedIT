import { ChartBarIcon, type Icon } from '@phosphor-icons/react'
import { ROUTES } from './constants'

interface IRoute {
  name: string
  path: string
  authed: boolean
  icon?: Icon
}

const signIn: IRoute = {
  name: ROUTES.SIGNIN.name,
  path: ROUTES.SIGNIN.path,
  authed: false
}
const signUp: IRoute = {
  name: ROUTES.SIGNUP.name,
  path: ROUTES.SIGNUP.path,
  authed: false
}
const dashboard: IRoute = {
  name: ROUTES.DASHBOARD.name,
  path: ROUTES.DASHBOARD.path,
  authed: true,
  icon: ChartBarIcon
}
const exampleTable: IRoute = {
  name: ROUTES.EXAMPLE_TABLE.name,
  path: ROUTES.EXAMPLE_TABLE.path,
  authed: true
}

const routes: IRoute[] = [signIn, signUp, dashboard, exampleTable]

export default routes
