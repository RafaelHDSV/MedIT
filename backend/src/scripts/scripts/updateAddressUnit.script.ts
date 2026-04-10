import { Unit } from '../../models/UnitModel.js'
import { Script } from '../types.js'

const parseAddress = (address: string) => {
  try {
    // Formato: "Rua X, 123 - Bairro, Cidade - UF"

    const lastDashIdx = address.lastIndexOf(' - ')
    const state = address.substring(lastDashIdx + 3).trim()
    const withoutState = address.substring(0, lastDashIdx)

    const firstDashIdx = withoutState.indexOf(' - ')
    const streetNumberPart = withoutState.substring(0, firstDashIdx).trim()
    const neighborhoodCityPart = withoutState.substring(firstDashIdx + 3).trim()

    const commaIdx = streetNumberPart.indexOf(',')
    const street = streetNumberPart.substring(0, commaIdx).trim()
    const number = streetNumberPart.substring(commaIdx + 1).trim()

    const lastCommaIdx = neighborhoodCityPart.lastIndexOf(',')
    const neighborhood = neighborhoodCityPart.substring(0, lastCommaIdx).trim()
    const city = neighborhoodCityPart.substring(lastCommaIdx + 1).trim()

    if (!street || !number || !neighborhood || !city || !state) {
      throw new Error(`Campos incompletos após parse`)
    }

    return { street, number, neighborhood, city, state }
  } catch (err) {
    // Log do erro real para diagnóstico
    console.log('Erro ao parsear:', address, '→', (err as Error).message)
    return null
  }
}

const updateAddressUnit: Script = {
  name: 'update-address-unit',
  description: 'Atualiza o campo address das unidades',
  async run() {
    const units = await Unit.find({})
    console.log(`Encontradas ${units.length} unidades`)

    for (const unit of units) {
      // Força conversão para string — address pode vir como objeto do Mongoose
      const rawAddress = String((unit as any)._doc?.address ?? unit.address)

      console.log(`O endereço era: ${rawAddress} (tipo: ${typeof rawAddress})`)

      if (
        !rawAddress ||
        rawAddress === 'null' ||
        rawAddress === '[object Object]'
      ) {
        console.log(`Ignorando unidade com address inválido: ${unit.name}`)
        continue
      }

      const parsed = parseAddress(rawAddress)
      if (!parsed) continue

      console.log(`O endereço mudou para:`, parsed)

      await Unit.updateOne({ _id: unit._id }, { $set: { address: parsed } })

      console.log(`Atualizado: ${unit.name}`)
    }

    console.log('Migração finalizada')
    process.exit(0)
  }
}

export default updateAddressUnit
