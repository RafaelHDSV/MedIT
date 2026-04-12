import type { IAddress } from "@/interfaces/IUnit"

const getFullAddress = (address?: IAddress) => {
  if (!address) return undefined

  const { street, number, neighborhood, city, state, zipCode } = address

  return `${street ?? '-'}, ${number ?? '-'} - ${neighborhood ?? '-'}, ${city ?? '-'} - ${state ?? '-'}, ${zipCode ?? '-'}`
}

export default getFullAddress