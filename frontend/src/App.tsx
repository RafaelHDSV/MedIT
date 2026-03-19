import { ConfigProvider } from 'antd'
import { Suspense } from 'react'
import { LayoutSpinner } from './components/LayoutSpinner/LayoutSpinner'
import { AuthProvider } from './contexts/AuthContext/AuthProvider'
import { SettingsProvider } from './contexts/SettingsContext/SettingsProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary-color')
    .trim()

  return (
    <Suspense fallback={<LayoutSpinner />}>
      <ConfigProvider theme={{ token: { colorPrimary: primaryColor } }}>
        <AuthProvider>
          <SettingsProvider>
            <AppRoutes />
          </SettingsProvider>
        </AuthProvider>
      </ConfigProvider>
    </Suspense>
  )
}

export default App
