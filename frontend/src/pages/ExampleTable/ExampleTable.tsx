import { Table } from 'antd'
import { useExampleTableColumns } from './hooks/useColumns'

function ExampleTable() {
  const columns = useExampleTableColumns()

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    },
    {
      key: '4',
      name: 'Jim Red',
      age: 32,
      address: 'London No. 2 Lake Park'
    },
    {
      key: '5',
      name: 'Jake White',
      age: 32,
      address: 'Dublin No. 2 Lake Park'
    },
    {
      key: '6',
      name: 'Jane Doe',
      age: 28,
      address: 'Paris No. 3 Lake Park'
    },
    {
      key: '7',
      name: 'Tom Smith',
      age: 45,
      address: 'Berlin No. 4 Lake Park'
    },
    {
      key: '8',
      name: 'Lucy Liu',
      age: 30,
      address: 'Tokyo No. 5 Lake Park'
    },
    {
      key: '9',
      name: 'Michael Johnson',
      age: 38,
      address: 'San Francisco No. 6 Lake Park'
    },
    {
      key: '10',
      name: 'Emily Davis',
      age: 27,
      address: 'Toronto No. 7 Lake Park'
    }
  ]

  return <Table dataSource={data} columns={columns} />
}

export default ExampleTable
