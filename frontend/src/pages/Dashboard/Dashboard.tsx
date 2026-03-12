import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '@/routes/constants'

function Dashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleGoToExampleTable() {
    navigate(ROUTES.EXAMPLE_TABLE.path)
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
