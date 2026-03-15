const cpfMask = (value: string | undefined) => {
  if (!value) return ''

  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

export type MaskEnum = 'cpf'

function masks(
  value: string | number | undefined | null | object | boolean,
  mask?: MaskEnum
): string {
  if (!value || typeof value === 'object') return ''

  const result = String(value)
  if (!mask) return result

  switch (mask.toLocaleLowerCase()) {
    case 'cpf':
      return cpfMask(result)
    default:
      return result
  }
}

export default masks
