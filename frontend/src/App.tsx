import { Suspense } from 'react'
import { LayoutSpinner } from './components/LayoutSpinner/LayoutSpinner'
import AntdConfigProvider from './contexts/AntdConfigProvider/AntdConfigProvider'
import { AuthProvider } from './contexts/AuthContext/AuthProvider'
import { ThemeProvider } from './contexts/ThemeContext/ThemeProvider'
import { DemoAutofillProvider } from './demo/DemoAutofillContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <Suspense fallback={<LayoutSpinner />}>
      <ThemeProvider>
        <AntdConfigProvider>
          <AuthProvider>
            <DemoAutofillProvider>
              <AppRoutes />
            </DemoAutofillProvider>
          </AuthProvider>
        </AntdConfigProvider>
      </ThemeProvider>
    </Suspense>
  )
}

export default App
