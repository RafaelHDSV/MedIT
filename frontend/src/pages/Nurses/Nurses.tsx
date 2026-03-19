import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IError } from '@/interfaces/IError'
import type { IUser } from '@/interfaces/IUser'
import { Flex, message, Table } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from './NursesTable.module.scss'
import { useNursesColumns } from './hooks/useNursesColumns'

function Nurses() {
  const columns = useNursesColumns()

const data = [
    {
      number: '1',
      name: 'John Brown',
      cpf: '534.432.423-34',
      email: 'john@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '2',
      name: 'Jim Green',
      cpf: '534.432.423-34',
      email: 'jim@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '3',
      name: 'Joe Black',
      cpf: '534.432.423-34',
      email: 'joe@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '4',
      name: 'Jim Red',
      cpf: '534.432.423-34',
      email: 'jim@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '5',
      name: 'Jake White',
      cpf: '534.432.423-34',
      email: 'jake@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '6',
      name: 'Jane Doe',
      cpf: '534.432.423-34',
      email: 'jane@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '7',
      name: 'Tom Smith',
      cpf: '534.432.423-34',
      email: 'tom@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '8',
      name: 'Lucy Liu',
      cpf: '534.432.423-34',
      email: 'lucy@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '9',
      name: 'Michael Johnson',
      cpf: '534.432.423-34',
      email: 'michaek@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    },
    {
      number: '10',
      name: 'Emily Davis',
      cpf: '534.432.423-34',
      email: 'emily@gmail.com',
      dtNascimento: '20/08/2004',
      cellphone: '(15)995728883',
      coren: '10999'
    }
  ]
  

  return (
    <div>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader />
        <ProgressTag status={ProgressStatus.NOT_STARTED} />
      </Flex>

    
      <Table
        className={styles.nursesTable}
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

export default Nurses
