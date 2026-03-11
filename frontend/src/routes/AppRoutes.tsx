import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from '../constants/routes'
import UnauthRoute from './UnauthRoute'
import AuthRoute from './AuthRoute'
import * as pages from '../pages/routerPages'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path={routes.SIGNIN}
          element={<UnauthRoute>{<pages.SignIn />}</UnauthRoute>}
        />

        <Route
          path={routes.SIGNUP}
          element={<UnauthRoute>{<pages.SignUp />}</UnauthRoute>}
        />

        {/* Rotas privadas */}
        <Route
          element={
            <AuthRoute>
              <pages.AppLayout />
            </AuthRoute>
          }
        >
          <Route path={routes.DASHBOARD} element={<pages.Dashboard />} />
          <Route path={routes.EXAMPLE_TABLE} element={<pages.ExampleTable />} />
        </Route>

        <Route path='*' element={<pages.NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
