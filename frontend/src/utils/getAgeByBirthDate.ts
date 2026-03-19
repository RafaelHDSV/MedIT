interface IGetAgeByBirthDateProps {
  birthDate: Date | string
}

function getAgeByBirthDate({ birthDate }: IGetAgeByBirthDateProps): number {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDifference = today.getMonth() - birth.getMonth()

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--
  }

  return age
}

export default getAgeByBirthDate
