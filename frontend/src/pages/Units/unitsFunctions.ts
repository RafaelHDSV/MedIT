import { TagStatuses } from '@/components/Tag/Tag'
import type { IUnit } from '@/interfaces/IUnit'

const getUnitStatus = (unit: IUnit): { text: string; status: TagStatuses } => {
  const now = new Date()

  const nowSP = new Date(
    now.toLocaleString('sv-SE', {
      timeZone: 'America/Sao_Paulo'
    })
  )

  const dayMap = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
  const todayKey = dayMap[nowSP.getDay()]

  const todayHours = unit.openingHours?.[todayKey]

  if (!todayHours) {
    return { text: 'Fechado', status: TagStatuses.ERROR }
  }

  const [openHour, openMinute] = todayHours.open.split(':').map(Number)
  const [closeHour, closeMinute] = todayHours.close.split(':').map(Number)

  const openDate = new Date(nowSP)
  openDate.setHours(openHour, openMinute, 0, 0)

  const closeDate = new Date(nowSP)
  closeDate.setHours(closeHour, closeMinute, 0, 0)

  if (nowSP < openDate || nowSP > closeDate) {
    return { text: 'Fechado', status: TagStatuses.ERROR }
  }

  const diffMs = closeDate.getTime() - nowSP.getTime()
  const diffMinutes = diffMs / (1000 * 60)

  if (diffMinutes <= 60) {
    return { text: 'Fechando', status: TagStatuses.WARNING }
  }

  return { text: 'Aberto', status: TagStatuses.SUCCESS }
}

export { getUnitStatus }
