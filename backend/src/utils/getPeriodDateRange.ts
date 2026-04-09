export const getPeriodDateRange = (period: string) => {
  const now = new Date(
    new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
  )

  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()
  const day = now.getDay()

  let start: Date
  let end: Date

  switch (period) {
    case 'day':
      start = new Date(Date.UTC(year, month, date, 0, 0, 0, 0))
      end = new Date(Date.UTC(year, month, date + 1, 0, 0, 0, 0) - 1)
      break

    case 'week': {
      const startDate = date - day

      start = new Date(Date.UTC(year, month, startDate, 0, 0, 0, 0))
      end = new Date(Date.UTC(year, month, startDate + 7, 0, 0, 0, 0) - 1)
      break
    }

    case 'month':
      start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
      end = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0) - 1)
      break

    case 'year':
      start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0))
      end = new Date(Date.UTC(year + 1, 0, 1, 0, 0, 0, 0) - 1)
      break

    default:
      start = new Date(Date.UTC(year, month, date, 0, 0, 0, 0))
      end = new Date(Date.UTC(year, month, date + 1, 0, 0, 0, 0) - 1)
      break
  }

  return { start, end }
}
