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
          path='/'
          element={
            <UnauthRoute>
              <pages.UnauthLayout />
            </UnauthRoute>
          }
        >
          <Route
            path={ROUTES.SIGNIN.path}
            element={<UnauthRoute>{<pages.SignIn />}</UnauthRoute>}
          />
          <Route
            path={ROUTES.SIGNUP.path}
            element={<UnauthRoute>{<pages.SignUp />}</UnauthRoute>}
          />
        </Route>

        {/* Rotas privadas */}
        <Route
          path='/auth'
          element={
            <AuthRoute>
              <pages.AuthLayout />
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
          <Route path={ROUTES.UNITS.path} element={<pages.Units />} />
          <Route
            path={ROUTES.MEDICAMENTS.path}
            element={<pages.Medications />}
          />
          <Route
            path={ROUTES.ATTENDANCE_DETAILS.path}
            element={<pages.AttendanceDetails />}
          />
          <Route
            path={ROUTES.ATTENDANCES.path}
            element={<pages.Attendances />}
          />
          <Route path={ROUTES.TRIAGES.path} element={<pages.Triages />} />
          <Route
            path={ROUTES.TRIAGES_DETAILS.path}
            element={<pages.AttendanceDetails />}
          />
          <Route
            path={ROUTES.PRE_REGISTRATION.path}
            element={<pages.PreRegistration />}
          />
        </Route>

        <Route element={<pages.UnauthLayout />}>
          <Route path='*' element={<pages.NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
