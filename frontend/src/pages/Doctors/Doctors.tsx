import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { ROUTES } from '@/routes/constants'
import { Button, Flex } from 'antd'
import { useNavigate } from 'react-router-dom'

function Doctors() {
  const navigate = useNavigate()

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.NOT_STARTED} />
      </Flex>

      <Button
        onClick={() =>
          navigate(
            ROUTES.DOCTORS_DETAILS.path.replace(
              ':id',
              '69b6d98f1f2cc36419496a16'
            )
          )
        }
      >
        Abrir detalhes
      </Button>
    </div>
  )
}

export default Doctors
