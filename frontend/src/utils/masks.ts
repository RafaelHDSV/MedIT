const cpfMask = (value?: string) => {
  if (!value) return ''

  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1')
}

const cellphoneMask = (value?: string) => {
  if (!value) return ''
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1')
}

const crmMask = (value?: string) => {
  if (!value) return ''
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '')
  const match = cleaned.match(/^(\d+)([a-zA-Z]+)?$/)
  if (!match) return value
  const num = match[1]
  const uf = match[2] ? match[2].toUpperCase() : ''
  return uf ? `${num}/${uf}` : num
}

const dateMask = (value?: string) => {
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

const corenMask = (value?: string) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '').slice(0, 6)
  if (numbers.length <= 3) return numbers
  return numbers.replace(/(\d{3})(\d+)/, '$1.$2')
}

const heightMask = (value?: string) => {
  if (!value) return ''
  const numbers = value.replace(/\D/g, '').slice(0, 3)
  if (numbers.length === 0) return ''
  if (numbers.length <= 1) return numbers
  if (numbers.length === 2)
    return `${numbers[0]}.${numbers[1]}${numbers[2] || ''}`.slice(0, 3)
  return `${numbers[0]}.${numbers.slice(1, 3)}`
}

const numberMask = (value?: number | string) => {
  if (!value) return ''
  return new Intl.NumberFormat('pt-BR').format(Number(value))
}

const booleanMask = (value?: string) => {
  if (!value) return ''
  return value === 'true' || value === '1' ? 'Sim' : 'Não'
}

export type MaskEnum =
  | 'cpf'
  | 'cellphone'
  | 'crm'
  | 'date'
  | 'coren'
  | 'height'
  | 'number'
  | 'boolean'

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
    case 'height':
      return heightMask(result)
    case 'number':
      return numberMask(result)
    case 'boolean':
      return booleanMask(result)
    default:
      return result
  }
}

export default masks
