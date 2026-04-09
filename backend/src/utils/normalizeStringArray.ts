const normalizeStringArray = (input: any): string[] => {
  if (!input) return []

  if (Array.isArray(input)) {
    return input
      .flatMap((item) =>
        String(item)
          .split(',')
          .map((i) => i.trim())
      )
      .filter(Boolean)
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean)
  }

  return []
}

export default normalizeStringArray
