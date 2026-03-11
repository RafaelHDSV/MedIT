import { useMemo } from 'react'

export function useDoctorTable() {
  const columns = useMemo(() => {
    const columns = [
      {
        title: 'Id',
        dataIndex: 'userid',
        key: 'userid',
      },
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'CPF',
        dataIndex: 'cpf',
        key: 'cpf'
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: 'Dt Nascimento',
        dataIndex: 'dtNascimento',
        key: 'dtNascimento'
      },
      {
        title: 'Telefone',
        dataIndex: 'telefone',
        key: 'telefone'
      },
       {
        title: 'CRM',
        dataIndex: 'crm',
        key: 'crm'
      },

    ]

    return columns
  }, [])

  return columns
}
