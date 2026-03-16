import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { ROUTES } from '@/routes/constants'
import { Button, Flex } from 'antd'
import { useNavigate } from 'react-router-dom'

function Patients() {
  const navigate = useNavigate()

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.NOT_STARTED} />
      </Flex>

      <Button
        onClick={() =>
          navigate(ROUTES.PATIENTS_DETAILS.path.replace(':id', '1'))
        }
      >
        Abrir detalhes de usuário exemplo
      </Button>
    </div>
  )
}

export default Patients
