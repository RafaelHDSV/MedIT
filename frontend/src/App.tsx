import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { LayoutSpinner } from './components/LayoutSpinner/LayoutSpinner'
import AntdConfigProvider from './contexts/AntdConfigProvider/AntdConfigProvider'
import { AuthProvider } from './contexts/AuthContext/AuthProvider'
import { SettingsProvider } from './contexts/SettingsContext/SettingsProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <Suspense fallback={<LayoutSpinner />}>
      <AntdConfigProvider>
        <AuthProvider>
          <SettingsProvider>
            <Analytics />
            <AppRoutes />
          </SettingsProvider>
        </AuthProvider>
      </AntdConfigProvider>
    </Suspense>
  )
}

export default App
