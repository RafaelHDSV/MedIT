import { BrowserRouter, Route, Routes } from 'react-router-dom'
import UnauthRoute from './UnauthRoute'
import AuthRoute from './AuthRoute'
import * as pages from '../pages/routerPages'
import { ROUTES } from './constants'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path={ROUTES.SIGNIN.path}
          element={<UnauthRoute>{<pages.SignIn />}</UnauthRoute>}
        />

        <Route
          path={ROUTES.SIGNUP.path}
          element={<UnauthRoute>{<pages.SignUp />}</UnauthRoute>}
        />

        {/* Rotas privadas */}
        <Route
          path='/auth'
          element={
            <AuthRoute>
              <pages.AppLayout />
            </AuthRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD.path} element={<pages.Dashboard />} />
          <Route path={ROUTES.DOCTORS.path} element={<pages.Doctors />} />
          <Route path={ROUTES.NURSE.path} element={<pages.Nurse />} />
          <Route path={ROUTES.PATIENTS.path} element={<pages.Patients />} />
          <Route
            path={ROUTES.MEDICAMENTS.path}
            element={<pages.Medications />}
          />
        </Route>

        <Route path='*' element={<pages.NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
