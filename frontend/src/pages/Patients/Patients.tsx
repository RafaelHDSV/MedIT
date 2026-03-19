import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import styles from '@/styles/UserTable.module.scss'
import { Flex, Table } from 'antd'
import { usePatientsColumns } from './hooks/usePatientsColumns'

function Patients() {
  const columns = usePatientsColumns()

  const data = [
    {
      number: '1',
      name: 'John Brown',
      cpf: '534.432.423-34',
      email: 'john@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '2',
      name: 'Jim Green',
      cpf: '534.432.423-34',
      email: 'jim@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '3',
      name: 'Joe Black',
      cpf: '534.432.423-34',
      email: 'joe@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '4',
      name: 'Jim Red',
      cpf: '534.432.423-34',
      email: 'jim@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '5',
      name: 'Jake White',
      cpf: '534.432.423-34',
      email: 'jake@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '6',
      name: 'Jane Doe',
      cpf: '534.432.423-34',
      email: 'jane@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '7',
      name: 'Tom Smith',
      cpf: '534.432.423-34',
      email: 'tom@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '8',
      name: 'Lucy Liu',
      cpf: '534.432.423-34',
      email: 'lucy@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '9',
      name: 'Michael Johnson',
      cpf: '534.432.423-34',
      email: 'michaek@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    },
    {
      number: '10',
      name: 'Emily Davis',
      cpf: '534.432.423-34',
      email: 'emily@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      sangue: 'O+'
    }
  ]

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.NOT_STARTED} />
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

export default Patients
