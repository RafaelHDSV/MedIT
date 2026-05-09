const MAX_LEN = 120

export function sanitizeWorkLocationLabel(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  return raw.trim().slice(0, MAX_LEN)
}
