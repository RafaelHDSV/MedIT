const isEmail = (value: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
  return emailRegex.test(value)
}

const isValidCPF = (cpf: string): boolean => {
  const clean = cpf.replace(/\D/g, '')

  if (clean.length !== 11) return false
  if (/^(\d)\1+$/.test(clean)) return false

  let sum = 0
  let rest

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (11 - i)
  }

  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(clean.substring(9, 10))) return false

  sum = 0

  for (let i = 1; i <= 10; i++) {
    sum += parseInt(clean.substring(i - 1, i)) * (12 - i)
  }

  rest = (sum * 10) % 11
  if (rest === 10 || rest === 11) rest = 0

  return rest === parseInt(clean.substring(10, 11))
}

const onlyNumbers = (value: string): boolean => {
  const numberRegex = /^\d+$/
  return numberRegex.test(value)
}

const signInIdentifier = (value: string): boolean => {
  if (!value) return false

  const clean = value.trim()
  const numbers = clean.replace(/\D/g, '')

  if (onlyNumbers(numbers)) {
    if (!isValidCPF(numbers)) {
      return false
    }
    return true
  }

  if (!isEmail(clean)) {
    return false
  }

  return true
}

export type ValidatorEnum =
  | 'email'
  | 'validCpf'
  | 'onlyNumbers'
  | 'signInIdentifier'

function validators(
  value: string | number | undefined | null | object | boolean,
  validator?: ValidatorEnum
): boolean {
  if (!value || typeof value === 'object') return false
  if (!validator) return true

  switch (validator.toLocaleLowerCase()) {
    case 'email':
      return isEmail(value as string)
    case 'validcpf':
      return isValidCPF(value as string)
    case 'onlynumbers':
      return onlyNumbers(value as string)
    case 'signinidentifier':
      return signInIdentifier(value as string)
    default:
      return true
  }
}

export default validators
