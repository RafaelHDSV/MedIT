import { useMemo } from 'react'

export function useExampleTableColumns() {
  const columns = useMemo(() => {
    const columns = [
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: 'Idade',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: 'Endereço',
        dataIndex: 'address',
        key: 'address'
      }
    ]

    return columns
  }, [])

  return columns
}
