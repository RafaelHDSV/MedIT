export function parseFiniteNumber(raw: unknown): number | undefined {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw

  if (typeof raw === 'string' && raw.trim()) {
    const number = parseFloat(raw.replace(',', '.'))
    if (Number.isFinite(number)) return number
  }

  return undefined
}

export function parsePositiveInt(raw: unknown): number | undefined {
  const parsedNumber = parseFiniteNumber(raw)
  if (parsedNumber === undefined) return undefined

  const integer = Math.round(parsedNumber)
  return integer >= 0 ? integer : undefined
}
