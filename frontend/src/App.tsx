import { Suspense } from 'react'
import { LayoutSpinner } from './components/LayoutSpinner/LayoutSpinner'
import AntdConfigProvider from './contexts/AntdConfigProvider/AntdConfigProvider'
import { AuthProvider } from './contexts/AuthContext/AuthProvider'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <Suspense fallback={<LayoutSpinner />}>
      <AntdConfigProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </AntdConfigProvider>
    </Suspense>
  )
}

export default App
