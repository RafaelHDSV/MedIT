import { ROUTES } from './constants'

const signIn = {
  name: ROUTES.SIGNIN.name,
  path: ROUTES.SIGNIN.path
}
const signUp = {
  name: ROUTES.SIGNUP.name,
  path: ROUTES.SIGNUP.path
}
const dashboard = {
  name: ROUTES.DASHBOARD.name,
  path: ROUTES.DASHBOARD.path
}
const exampleTable = {
  name: ROUTES.EXAMPLE_TABLE.name,
  path: ROUTES.EXAMPLE_TABLE.path
}

const routes = [signIn, signUp, dashboard, exampleTable]

export default routes
