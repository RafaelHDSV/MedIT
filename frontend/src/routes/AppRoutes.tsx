import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from '../constants/routes'
import AppLayout from '../layouts/AppLayout'
import Dashboard from '../pages/Dashboard/Dashboard'
import ExampleTable from '../pages/ExampleTable/ExampleTable'
import SignIn from '../pages/SignIn/SignIn'
import SignUp from '../pages/SignUp/SignUp'
import AuthRoute from './AuthRoute'
import UnauthRoute from './UnauthRoute'
import DoctorDetails from '../pages/DoctorDetails/DoctorDetails'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path={routes.SIGNIN}
          element={
            <UnauthRoute>
              <SignIn />
            </UnauthRoute>
          }
        />

        <Route
          path={routes.SIGNUP}
          element={
            <UnauthRoute>
              <SignUp />
            </UnauthRoute>
          }
        />

        {/* Rotas privadas */}
        <Route
          element={
            <AuthRoute>
              <AppLayout />
            </AuthRoute>
          }
        >
          <Route path={routes.DASHBOARD} element={<Dashboard />} />
          <Route path={routes.EXAMPLE_TABLE} element={<ExampleTable />} />
          <Route path={routes.DOCTOR_DETAILS} element={<DoctorDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
