export function getInitials(name: string): string {
  if (!name) return ''

  const parts = name.trim().split(' ')

  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
