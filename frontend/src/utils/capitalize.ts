function capitalize(text?: string): string {
  if (!text) return ''

  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default capitalize
