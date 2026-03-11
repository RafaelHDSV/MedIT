import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div>
      <header>MedFlow</header>

      <main>
        <Outlet />
      </main>
    </div>
  )
}
