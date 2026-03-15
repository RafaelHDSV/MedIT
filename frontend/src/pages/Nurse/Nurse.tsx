import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { Flex } from 'antd'

function Nurse() {
  return (
    <Flex gap={16} align='center'>
      <h1>Nurse</h1>
      <ProgressTag status={ProgressStatus.NOT_STARTED} />
    </Flex>
  )
}

export default Nurse
