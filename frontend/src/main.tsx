import { VieiraAnalytics } from '@vieira/analytics/react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.scss'

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <VieiraAnalytics projectKey="medit" />
  </>
)
