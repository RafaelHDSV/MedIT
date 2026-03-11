import { Table } from 'antd'
import { useDoctorTable } from './hooks/useColumns'
import './DoctorTable.module.scss' 

function DoctorTable() {
  const columns = useDoctorTable()

  const data = [
    {
      key: '1',
      userid: '1',
      name: 'John Brown',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '2',
      userid: '2',
      name: 'Jim Green',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '3',
      userid: '3',
      name: 'Joe Black',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '4',
      userid: '4',
      name: 'Jim Red',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '5',
      userid: '5',
      name: 'Jake White',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '6',
      userid: '6',
      name: 'Jane Doe',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '7',
      userid: '7',
      name: 'Tom Smith',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '8',
      userid: '8',
      name: 'Lucy Liu',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '9',
      userid: '9',
      name: 'Michael Johnson',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    },
    {
      key: '10',
      userid: '10',
      name: 'Emily Davis',
      cpf: '534.432.423-34',
      email: 'rafaelviado@gmail.com',
      dtNascimento: '20/08/2004',
      telefone: '(15)995728883',
      crm: '10999'
    }
  ]

  return <Table dataSource={data} columns={columns} className="tbMedicos"/>
}

export default DoctorTable
