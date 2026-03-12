import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/constants'

function Dashboard() {
  const navigate = useNavigate()

  function handleGoToExampleTable() {
    navigate(ROUTES.EXAMPLE_TABLE.path)
  }

  return (
    <div>
      <div>Dashboard</div>
      <button onClick={handleGoToExampleTable}>Tabela de exemplo</button>
    </div>
  )
}

export default Dashboard
