import { useAuth } from '../../hooks/useAuth'

function Dashboard() {
  const { logout } = useAuth()

  function handleExit() {
    logout()
  }

  return (
    <div>
      <div>Dashboard</div>
      <button onClick={handleExit}>Sair</button>
    </div>
  )
}

export default Dashboard
