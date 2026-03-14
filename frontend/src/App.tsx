import { Suspense } from 'react'
import { AuthProvider } from './contexts/AuthContext/AuthProvider'
import { SettingsProvider } from './contexts/SettingsContext/SettingsProvider'
import { LayoutSpinner } from './layouts/components/LayoutSpinner/LayoutSpinner'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <Suspense fallback={<LayoutSpinner />}>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </AuthProvider>
    </Suspense>
  )
}

export default App
