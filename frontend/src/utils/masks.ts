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

const dateMask = (value: string | undefined) => {
  if (!value) return ''

  let v = value.replace(/\D/g, '').slice(0, 8)

  if (v.length >= 2) {
    const day = parseInt(v.slice(0, 2))
    if (day > 31) v = '31' + v.slice(2)
  }

  if (v.length >= 4) {
    const month = parseInt(v.slice(2, 4))
    if (month > 12) v = v.slice(0, 2) + '12' + v.slice(4)
  }

  if (v.length <= 2) return v
  if (v.length <= 4) return `${v.slice(0, 2)}/${v.slice(2)}`
  return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
}

const corenMask = (value: string | undefined) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '').slice(0, 6)
  if (numbers.length <= 3) return numbers
  return numbers.replace(/(\d{3})(\d+)/, '$1.$2')
}

export type MaskEnum = 'cpf' | 'cellphone' | 'crm' | 'date' | 'coren'

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
    case 'date':
      return dateMask(result)
    case 'coren':
      return corenMask(result)
    default:
      return result
  }
}

export default masks
