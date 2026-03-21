import type { ITriagem } from '@/interfaces/IUser'
import { ROUTES } from '@/routes/constants'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { ObjectId } from 'mongoose'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export function useTriagesColumns() {
  const navigate = useNavigate()

  const handleNavigateToDetails = useCallback(
    (id: ObjectId | undefined) => {
      if (!id) return
      navigate(ROUTES.TRIAGES_DETAILS.path.replace(':id', id.toString()))
    },
    [navigate]
  )


  const columns: ColumnsType<ITriagem> = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'number',
        key: 'number'
      },
      {
        title: 'Nome',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Idade',
        dataIndex: 'idade',
        key: 'idade',
      },
      {
        title: 'Queixa',
        dataIndex: 'queixa',
        key: 'queixa'
      },
      {
        title: 'Data',
        dataIndex: 'data',
        key: 'data',
      },
      {
        title: 'Risco',
        dataIndex: 'risco',
        key: 'risco',
        render: (risco: string) => {
        const styles: Record<string, React.CSSProperties> = {
          Alto: { border: '1px solid #f87171', color: '#ef4444', background: '#fef2f2' },
          Médio: { border: '1px solid #f1b98b', color: '#f1b98b', background: '#fff7ed' },
          Baixo: { border: '1px solid #4ade80', color: '#16a34a', background: '#f0fdf4' },
        }
        return (
          <span style={{
            ...styles[risco],
            fontSize: '12px',
            padding: '2px 10px',
            borderRadius: '999px',
            fontWeight: 500,
          }}>
            {risco}
          </span>
        )
      },
      },
      {
        title: 'Criado em',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: Date | string) => dayjs(date).format('DD/MM/YYYY HH:mm')
      },
      {
        title: 'Atualizado em',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (date: Date | string) => dayjs(date).format('DD/MM/YYYY HH:mm')
      }
    ],
    [handleNavigateToDetails]
  )

  return columns
}
