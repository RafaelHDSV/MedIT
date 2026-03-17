import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import { ROUTES } from '@/routes/constants'
import { Button, Flex, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './DoctorTable.module.scss'
import { useDoctorsColumns } from './hooks/useColumns'

export interface IDoctorList {
  _id: string
  name: string
  cpf: string
  email: string
  birthDate: string
  cellphone: string
  crm: string
}

function Doctors() {
  const columns = useDoctorsColumns()
  const navigate = useNavigate()

  const data: IDoctorList[] = Array(25)
    .fill(0)
    .map((_, index) => ({
      _id: (index + 1).toString(),
      name: 'John Brown',
      cpf: '53443242334',
      email: 'rafael@gmail.com',
      birthDate: '2004-08-20',
      cellphone: '15995728883',
      crm: '10999'
    }))

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
        Abrir detalhes de usuário exemplo
      </Button>

      <Table
        className={styles.doctorTable}
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

export default Doctors
