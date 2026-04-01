export const getPeriodDateRange = (period: string) => {
  const now = new Date()

  let start: Date
  let end: Date

  switch (period) {
    case 'day':
      start = new Date(
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

      end = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999
        )
      )
      break

    case 'week': {
      const day = now.getUTCDay()
      const diff = now.getUTCDate() - day

      start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff, 0, 0, 0, 0)
      )

      end = new Date(start)
      end.setUTCDate(start.getUTCDate() + 6)
      end.setUTCHours(23, 59, 59, 999)
      break
    }

    case 'month':
      start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
      )

      end = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth() + 1,
          0,
          23,
          59,
          59,
          999
        )
      )
      break

    case 'year':
      start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0))

      end = new Date(Date.UTC(now.getUTCFullYear(), 11, 31, 23, 59, 59, 999))
      break

    default:
      start = new Date(
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

      end = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999
        )
      )
      break
  }

  return { start, end }
}
