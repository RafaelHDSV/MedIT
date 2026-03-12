import { ROUTES } from './constants'

const signIn = {
  name: ROUTES.SIGNIN.name,
  path: ROUTES.SIGNIN.path,
  authed: false
}
const signUp = {
  name: ROUTES.SIGNUP.name,
  path: ROUTES.SIGNUP.path,
  authed: false
}
const dashboard = {
  name: ROUTES.DASHBOARD.name,
  path: ROUTES.DASHBOARD.path,
  authed: true
}
const exampleTable = {
  name: ROUTES.EXAMPLE_TABLE.name,
  path: ROUTES.EXAMPLE_TABLE.path,
  authed: true
}

const routes = [signIn, signUp, dashboard, exampleTable]

export default routes
