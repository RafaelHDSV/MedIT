/**
 * Oculta caracteres de nomes de terceiros (minimizacao LGPD na fila do paciente).
 */
export function maskSensitiveName(name: string | undefined | null): string {
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
