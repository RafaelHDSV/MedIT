import dayjs from 'dayjs'

export function timeAgo(date?: string | Date) {
  if (!date) return ''

  const now = dayjs()
  const target = dayjs(date)

  const diffMinutes = now.diff(target, 'minute')
  const diffHours = now.diff(target, 'hour')
  const diffDays = now.diff(target, 'day')

  if (diffMinutes < 1) return 'Aguardando há poucos segundos'

  if (diffMinutes < 60) {
    return `Aguardando há ${diffMinutes} min`
  }

  if (diffHours < 24) {
    return `Aguardando há ${diffHours}h`
  }

  return `Aguardando há ${diffDays}d`
}
