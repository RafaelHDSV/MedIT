import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Dashboard from '../pages/Dashboard/Dashboard'
import ExampleTable from '../pages/ExampleTable/ExampleTable'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import AuthRoute from './AuthRoute'
import UnauthRoute from './UnauthRoute'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path='/login'
          element={
            <UnauthRoute>
              <Login />
            </UnauthRoute>
          }
        />

        <Route
          path='/signup'
          element={
            <UnauthRoute>
              <SignUp />
            </UnauthRoute>
          }
        />

        {/* Rotas privadas */}
        <Route
          path='/'
          element={
            <AuthRoute>
              <Dashboard />
            </AuthRoute>
          }
        />

        <Route
          path='/example-table'
          element={
            <AuthRoute>
              <ExampleTable />
            </AuthRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
