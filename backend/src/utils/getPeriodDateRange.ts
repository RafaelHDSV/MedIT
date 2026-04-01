export const getPeriodDateRange = (period: string) => {
  const now = new Date()

  let start: Date
  let end: Date

  const base = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0
    )
  )

  switch (period) {
    case 'day':
      start = new Date(base)

      end = new Date(base)
      end.setUTCHours(23, 59, 59, 999)
      break

    case 'week': {
      const dayOfWeek = base.getUTCDay()

      start = new Date(base)
      start.setUTCDate(base.getUTCDate() - dayOfWeek)

      end = new Date(start)
      end.setUTCDate(start.getUTCDate() + 6)
      end.setUTCHours(23, 59, 59, 999)
      break
    }

    case 'month':
      start = new Date(
        Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1, 0, 0, 0, 0)
      )

      end = new Date(
        Date.UTC(
          base.getUTCFullYear(),
          base.getUTCMonth() + 1,
          0,
          23,
          59,
          59,
          999
        )
      )
      break

    case 'year':
      start = new Date(Date.UTC(base.getUTCFullYear(), 0, 1, 0, 0, 0, 0))

      end = new Date(Date.UTC(base.getUTCFullYear(), 11, 31, 23, 59, 59, 999))
      break

    default:
      start = new Date(base)

      end = new Date(base)
      end.setUTCHours(23, 59, 59, 999)
      break
  }

  return { start, end }
}
