import { BrowserRouter, Route, Routes } from 'react-router-dom'
import * as pages from '../pages/routerPages'
import AuthRoute from './AuthRoute'
import { ROUTES } from './constants'
import UnauthRoute from './UnauthRoute'

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
          <Route path={ROUTES.DOCTOR_DETAILS.path} element={<pages.DoctorDetails />} />
          <Route path={ROUTES.NURSE.path} element={<pages.Nurse />} />
          <Route path={ROUTES.PATIENTS.path} element={<pages.Patients />} />
          <Route
            path={ROUTES.MEDICAMENTS.path}
            element={<pages.Medications />}
          />
          <Route
            path={ROUTES.ATTENDANCES.path}
            element={<pages.Attendances />}
          />
          <Route path={ROUTES.TRIAGES.path} element={<pages.Triages />} />
        </Route>

        <Route path='*' element={<pages.NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
