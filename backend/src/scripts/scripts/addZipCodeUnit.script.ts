import { Unit } from '../../models/UnitModel.js'
import { Script } from '../types.js'

interface ParsedAddress {
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode?: string
}

interface ViaCepResult {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

const normalize = (str: string) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const expandAbbreviations = (street: string) =>
  street
    .replace(/\bAv\.\s*/gi, 'Avenida ')
    .replace(/\bCel\.\s*/gi, 'Coronel ')
    .replace(/\bDep\.\s*/gi, 'Deputado ')
    .replace(/\bDr\.\s*/gi, 'Doutor ')
    .replace(/\bSte\.\s*/gi, 'Santo ')
    .trim()

// Extrai palavras relevantes (ignora artigos/preposições curtas)
const keywords = (str: string): string[] =>
  normalize(str)
    .split(/\s+/)
    .filter((w) => w.length > 3)

// Verifica se o logradouro retornado realmente corresponde à rua buscada
const logradouroMatches = (returned: string, searched: string): boolean => {
  const returnedKw = keywords(returned)
  const searchedKw = keywords(searched)
  // Exige que pelo menos metade das palavras-chave da busca apareçam no resultado
  const matches = searchedKw.filter((w) => returnedKw.includes(w))
  return matches.length >= Math.ceil(searchedKw.length / 2)
}

const queryViaCep = async (
  state: string,
  city: string,
  street: string
): Promise<ViaCepResult[] | null> => {
  const url = `https://viacep.com.br/ws/${state}/${encodeURIComponent(normalize(city))}/${encodeURIComponent(normalize(street))}/json/`
  console.log(`    GET ${url}`)

  const res = await fetch(url)
  if (!res.ok) return null

  const text = await res.text()
  try {
    const data = JSON.parse(text)
    return Array.isArray(data) && data.length > 0 ? data : null
  } catch {
    return null
  }
}

const fetchCep = async (address: ParsedAddress): Promise<string | null> => {
  const expanded = expandAbbreviations(address.street)

  const tryFetch = async (streetQuery: string): Promise<string | null> => {
    const results = await queryViaCep(address.state, address.city, streetQuery)
    if (!results) return null

    // Filtra apenas resultados cujo logradouro realmente corresponde à rua
    const valid = results.filter((d) =>
      logradouroMatches(d.logradouro, expanded)
    )

    if (valid.length === 0) {
      console.log(`    Resultados descartados (logradouro não corresponde)`)
      return null
    }

    // Entre os válidos, prefere o que bate com o bairro
    const match =
      valid.find((d) =>
        normalize(d.bairro).includes(normalize(address.neighborhood))
      ) ?? valid[0]

    const cep = match.cep.replace('-', '')
    console.log(
      `  CEP encontrado: ${cep} (${match.logradouro} - ${match.bairro})`
    )
    return cep
  }

  // Tentativa 1: nome completo
  let cep = await tryFetch(expanded)
  if (cep) return cep

  // Tentativa 2: 4 primeiras palavras
  const shortened4 = expanded.split(' ').slice(0, 4).join(' ')
  if (shortened4 !== expanded) {
    console.log(`    Tentando: "${shortened4}"`)
    cep = await tryFetch(shortened4)
    if (cep) return cep
  }

  // Tentativa 3: 3 primeiras palavras
  const shortened3 = expanded.split(' ').slice(0, 3).join(' ')
  if (shortened3 !== shortened4) {
    console.log(`    Tentando: "${shortened3}"`)
    cep = await tryFetch(shortened3)
    if (cep) return cep
  }

  console.log(`  Nenhum resultado válido para: ${address.street}`)
  return null
}

const addZipCodeUnit: Script = {
  name: 'add-zipcode-unit',
  description: 'Adiciona o CEP ao campo address das unidades via ViaCEP',
  async run() {
    const units = await Unit.find({})
    console.log(`Encontradas ${units.length} unidades\n`)

    for (const unit of units) {
      const address = (unit as any)._doc?.address ?? unit.address

      console.log(`Unidade: ${unit.name}`)

      if (!address || typeof address !== 'object' || Array.isArray(address)) {
        console.log(
          `  ⚠️  Endereço não é objeto — rode update-address-unit antes.\n`
        )
        continue
      }

      const parsed = address as ParsedAddress

      if (parsed.zipCode) {
        console.log(`  ✅ Já possui CEP: ${parsed.zipCode}\n`)
        continue
      }

      if (!parsed.street || !parsed.city || !parsed.state) {
        console.log(`  ⚠️  Endereço incompleto, pulando.\n`)
        continue
      }

      const zipCode = await fetchCep(parsed)

      if (!zipCode) {
        console.log(`  ❌ Não foi possível obter o CEP.\n`)
      } else {
        await Unit.updateOne(
          { _id: unit._id },
          { $set: { 'address.zipCode': zipCode } }
        )
        console.log(`  ✅ CEP ${zipCode} salvo.\n`)
      }

      await new Promise((resolve) => setTimeout(resolve, 400))
    }

    console.log('Migração de CEPs finalizada')
    process.exit(0)
  }
}

export default addZipCodeUnit
