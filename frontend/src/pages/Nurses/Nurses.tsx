import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import ListTable from '@/components/ListTable/ListTable'
import ProgressTag, {
  ProgressStatus
} from '@/components/ProgressTag/ProgressTag'
import type { IError } from '@/interfaces/IError'
import type { INurse } from '@/interfaces/INurse'
import { Flex, message } from 'antd'
import type { AxiosError } from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNursesColumns } from './hooks/useNursesColumns'

function Nurses() {
  const columns = useNursesColumns()
  const [nurses, setNurses] = useState<INurse[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchNurses() {
    setLoading(true)

    try {
      const response = await api.get('/nurses')
      const data = response.data
      setNurses(data)
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.error(error)
      message.error(
        error.response?.data?.message ||
          'Erro ao carregar a listagem de enfermeiros'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNurses()
  }, [])

  return (
    <div className='h-100'>
      <Flex gap={16} align='center'>
        <AuthLayoutHeader
          actionComponent={<Button>Adicionar enfermeiro</Button>}
        />
        <ProgressTag status={ProgressStatus.COMPLETED} />
      </Flex>

      <ListTable<INurse>
        dataSource={nurses}
        columns={columns}
        loading={loading}
        onReload={fetchNurses}
      />
    </div>
  )
}

export default Nurses
