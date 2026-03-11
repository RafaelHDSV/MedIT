import { Suspense } from 'react'
import { AuthProvider } from './contexts/AuthProvider'
import AppRoutes from './routes/AppRoutes'
import { LayoutSpinner } from './layouts/components/LayoutSpinner/LayoutSpinner'

function App() {
  return (
    <Suspense fallback={<LayoutSpinner />}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Suspense>
  )
}

export default App
