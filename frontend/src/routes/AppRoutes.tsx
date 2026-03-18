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
          path={ROUTES.SIGNINJOTA.path}
          element={<UnauthRoute>{<pages.SignInJOTA />}</UnauthRoute>}
        />

        <Route
          path={ROUTES.SIGNUP.path}
          element={<UnauthRoute>{<pages.SignUp />}</UnauthRoute>}
        />
        <Route
          path={ROUTES.SIGNUPJOTA.path}
          element={<UnauthRoute>{<pages.SignUpJOTA />}</UnauthRoute>}
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
          <Route
            path={ROUTES.DOCTORS_DETAILS.path}
            element={<pages.DoctorDetails />}
          />
          <Route path={ROUTES.NURSES.path} element={<pages.Nurses />} />
          <Route
            path={ROUTES.NURSES_DETAILS.path}
            element={<pages.NursesDetails />}
          />
          <Route path={ROUTES.PATIENTS.path} element={<pages.Patients />} />
          <Route
            path={ROUTES.PATIENTS_DETAILS.path}
            element={<pages.PatientsDetails />}
          />
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
