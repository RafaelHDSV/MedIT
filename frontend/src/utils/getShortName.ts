function getShortName(fullName?: string) {
  if (!fullName) return 'Usuário'

  const parts = fullName.trim().split(' ')
  if (parts.length === 1) return parts[0]
  return `${parts[0]} ${parts[parts.length - 1]}`
}

export default getShortName
