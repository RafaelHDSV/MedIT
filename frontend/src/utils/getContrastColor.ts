export function getContrastColor(backgroundColor: string) {
  const match = backgroundColor.match(/\d+/g)
  if (!match) return 'var(--white)'

  const hue = Number(match[0])

  return hue > 200 ? 'var(--black)' : 'var(--white)'
}
