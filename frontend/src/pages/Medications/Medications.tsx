import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { Flex } from 'antd'

function Medications() {
  return (
    <Flex gap={16} align='center'>
      <AuthLayoutHeader />
      <ProgressTag status={ProgressStatus.NOT_STARTED} />
    </Flex>
  )
}

export default Medications
