import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import { ObjectId } from '@/utils/objectId'
import { Table } from 'antd'
import styles from '../../components/ListTable/ListTable.module.scss'
import { useAttendancesColumns } from './hooks/useAttendancesColumns'

function IAttendances() {
  const columns = useAttendancesColumns()

  // VIEIRA: Corrigir tipagem any
  const data: any = [
    {
      _id: ObjectId('69bef9b46b9f5d4381a706a9'),
      number: 1,
      complaint: 'Náusea',
      diagnosis: 'Gastroenterite',
      date: new Date(),
      risk: AttendanceRisk.EMERGENCY
    },
    {
      _id: ObjectId('69bef9bc7e5523fdd7c7a18b'),
      number: 2,
      complaint: 'Dor de cabeça',
      diagnosis: 'Enxaqueca',
      date: new Date(),
      risk: AttendanceRisk.URGENT
    },
    {
      _id: ObjectId('69bef9bedb1e8c62ac29e060'),
      number: 3,
      complaint: 'Dor abdominal',
      diagnosis: 'Apendicite',
      date: new Date(),
      risk: AttendanceRisk.NOT_URGENT
    },
    {
      _id: ObjectId('69bef9c1d09e37a45f690251'),
      number: 4,
      complaint: 'Febre',
      diagnosis: 'Infecção viral',
      date: new Date(),
      risk: AttendanceRisk.LESS_URGENT
    },
    {
      _id: ObjectId('69bef9c39f7bcc9313543d2a'),
      number: 5,
      complaint: 'Tosse',
      diagnosis: 'Bronquite',
      date: new Date(),
      risk: AttendanceRisk.VERY_URGENT
    },
    {
      _id: ObjectId('69bef9c5d686012355a4cf4d'),
      number: 6,
      complaint: 'Dor de garganta',
      diagnosis: 'Faringite',
      date: new Date(),
      risk: AttendanceRisk.URGENT
    }
  ]

  return (
    <div className='h-100'>
      <AuthLayoutHeader />

      <Table
        className={styles.userTable}
        rowKey='_id'
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 9 }}
        size='middle'
        bordered={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default IAttendances
