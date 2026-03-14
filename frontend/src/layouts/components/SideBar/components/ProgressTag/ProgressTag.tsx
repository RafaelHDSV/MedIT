import { useAuth } from '@/hooks/useAuth'
import { Roles } from '@/interfaces/IUser'
import { CheckIcon, HourglassMediumIcon, XIcon } from '@phosphor-icons/react'
import { Tag, Tooltip } from 'antd'
import { useMemo } from 'react'

export const ProgressStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
} as const
export type ProgressStatus =
  (typeof ProgressStatus)[keyof typeof ProgressStatus]

interface IProgressTagProps {
  status?: ProgressStatus
}

function ProgressTag({ status }: IProgressTagProps) {
  const { user } = useAuth()
  const isAdmin = user?.role === Roles.ADMIN

  const { tooltip, color, icon } = useMemo(() => {
    const unknownState = {
      tooltip: 'Desconhecido',
      color: 'red',
      icon: <XIcon />
    }
    if (!status) return unknownState

    switch (status) {
      case 'not_started':
        return { tooltip: 'Não iniciado', color: 'red', icon: <XIcon /> }
      case 'in_progress':
        return {
          tooltip: 'Em andamento',
          color: 'blue',
          icon: <HourglassMediumIcon />
        }
      case 'completed':
        return { tooltip: 'Concluído', color: 'green', icon: <CheckIcon /> }
      default:
        return unknownState
    }
  }, [status])

  if (!isAdmin) return

  return (
    <Tooltip title={tooltip}>
      <Tag color={color}>{icon}</Tag>
    </Tooltip>
  )
}

export default ProgressTag
