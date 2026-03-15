const isEmail = (value: string): boolean => {
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
  return emailRegex.test(value)
}

export type ValidatorEnum = 'email'

function validators(
  value: string | number | undefined | null | object | boolean,
  validator?: ValidatorEnum
): boolean {
  if (!value || typeof value === 'object') return false
  if (!validator) return true

  switch (validator.toLocaleLowerCase()) {
    case 'email':
      return isEmail(value as string)
    default:
      return true
  }
}

export default validators