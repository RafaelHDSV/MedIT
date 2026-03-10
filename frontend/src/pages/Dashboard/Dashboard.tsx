import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleGoToExampleTable() {
    navigate('/example-table')
  }

  function handleExit() {
    logout()
  }

  return (
    <div>
      <div>Dashboard</div>
      <button onClick={handleGoToExampleTable}>Tabela de exemplo</button>
      <button onClick={handleExit}>Sair</button>
    </div>
  )
}

export default Dashboard
