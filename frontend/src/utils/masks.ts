const cpfMask = (value: string | undefined) => {
  if (!value) return ''

  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

const cellphoneMask = (value: string | undefined) => {
  if (!value) return ''
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

const crmMask = (value: string | undefined) => {
  if (!value) return ''
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '')
  const match = cleaned.match(/^(\d+)([a-zA-Z]+)?$/)
  if (!match) return value
  const num = match[1]
  const uf = match[2] ? match[2].toUpperCase() : ''
  return uf ? `${num}/${uf}` : num
}

export type MaskEnum = 'cpf' | 'cellphone' | 'crm'

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
    case 'cellphone':
      return cellphoneMask(result)
    case 'crm':
      return crmMask(result)
    default:
      return result
  }
}

export default masks
