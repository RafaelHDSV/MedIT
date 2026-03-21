import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { TriagesRisk, type ITriages } from '@/interfaces/ITriages'
import styles from '@/styles/UserTable.module.scss'
import { ObjectId } from '@/utils/objectId'
import { Flex, Table } from 'antd'
import { useTriagesColumns } from './hooks/useTriagesColumns'

function ITriages() {
  const columns = useTriagesColumns()

  const data: ITriages[] = [
    {
      _id: ObjectId('69bef9b46b9f5d4381a706a9'),
      number: 1,
      name: 'John Doe',
      birthDate: new Date('1990-01-01'),
      complaint: 'Náusea',
      date: new Date(),
      risk: TriagesRisk.EMERGENCY
    },
    {
      _id: ObjectId('69bef9bc7e5523fdd7c7a18b'),
      number: 2,
      name: 'Jane Smith',
      birthDate: new Date('1985-05-15'),
      complaint: 'Dor de cabeça',
      date: new Date(),
      risk: TriagesRisk.URGENT
    },
    {
      _id: ObjectId('69bef9bedb1e8c62ac29e060'),
      number: 3,
      name: 'Alice Johnson',
      birthDate: new Date('1978-09-30'),
      complaint: 'Dor abdominal',
      date: new Date(),
      risk: TriagesRisk.NOT_URGENT
    },
    {
      _id: ObjectId('69bef9c1d09e37a45f690251'),
      number: 4,
      name: 'Bob Brown',
      birthDate: new Date('1992-07-20'),
      complaint: 'Febre',
      date: new Date(),
      risk: TriagesRisk.LESS_URGENT
    },
    {
      _id: ObjectId('69bef9c39f7bcc9313543d2a'),
      number: 5,
      name: 'Charlie Davis',
      birthDate: new Date('1988-11-10'),
      complaint: 'Tosse',
      date: new Date(),
      risk: TriagesRisk.VERY_URGENT
    },
    {
      _id: ObjectId('69bef9c5d686012355a4cf4d'),
      number: 6,
      name: 'Emily Wilson',
      birthDate: new Date('1995-03-25'),
      complaint: 'Dor de garganta',
      date: new Date(),
      risk: TriagesRisk.URGENT
    }
  ]

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.COMPLETED} />
      </Flex>

      <Table
        className={styles.userTable}
        rowKey='_id'
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 10 }}
        size='middle'
        bordered={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default ITriages
