import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Dashboard from '../pages/Dashboard/Dashboard'
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
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
