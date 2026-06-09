/**
 * Oculta caracteres de nomes de terceiros (minimizacao LGPD na fila do paciente).
 * Mantem a primeira letra de cada palavra; o restante vira asteriscos.
 */
export function maskSensitiveName(
  name: string | undefined | null,
  options?: { reveal?: boolean }
): string {
  if (options?.reveal) return name?.trim() || ''
  if (!name?.trim()) return 'Paciente'

  return name
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (word.length <= 1) return '*'
      return word[0] + '*'.repeat(word.length - 1)
    })
    .join(' ')
}
