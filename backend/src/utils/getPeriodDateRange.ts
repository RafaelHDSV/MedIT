const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

/**
 * Intervalo [start, end] em UTC para agregações por `period`.
 * `referenceDate` opcional (YYYY-MM-DD): ancoragem do dia/semana/mês/ano
 * escolhidos no dashboard; sem valor, usa a data atual em America/Sao_Paulo.
 */
export const getPeriodDateRange = (
  period: string,
  referenceDate?: string
) => {
  let year: number
  let month: number
  let date: number
  let day: number

  const part = referenceDate?.trim().split('T')[0]
  const match = part ? ISO_DATE.exec(part) : null

  if (match) {
    year = Number(match[1])
    month = Number(match[2]) - 1
    date = Number(match[3])
    const noonUtc = new Date(Date.UTC(year, month, date, 12, 0, 0, 0))
    day = noonUtc.getUTCDay()
  } else {
    const now = new Date(
      new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
    )
    year = now.getFullYear()
    month = now.getMonth()
    date = now.getDate()
    day = now.getDay()
  }

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
