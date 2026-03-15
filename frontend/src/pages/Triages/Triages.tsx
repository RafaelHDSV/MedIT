import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { Flex } from 'antd'

function Triages() {
  return (
    <Flex gap={16} align='center'>
      <h1>Triages</h1>
      <ProgressTag status={ProgressStatus.NOT_STARTED} />
    </Flex>
  )
}

export default Triages
