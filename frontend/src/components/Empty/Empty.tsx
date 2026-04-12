import { Flex } from 'antd'

function Empty() {
  return (
    <Flex vertical align='center' justify='center' gap={16}>
      <img src='/no-data.svg' alt='No data' className='noDataImage' />
      <span>Nenhuma informação encontrada para essa consulta</span>
    </Flex>
  )
}

export default Empty
