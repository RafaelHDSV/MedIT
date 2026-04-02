export function timeFormatter(time: number) {
  const hours = Math.floor(time / 60)
  const minutes = time % 60
  if (hours > 0) return `${hours}h ${minutes}min`
  return `${minutes}min`
}
