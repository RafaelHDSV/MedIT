import { Suspense } from 'react'
import { LayoutSpinner } from './components/LayoutSpinner/LayoutSpinner'
import { AuthProvider } from './contexts/AuthContext/AuthProvider'
import { SettingsProvider } from './contexts/SettingsContext/SettingsProvider'
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
