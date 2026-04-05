import { Unit } from '../../models/UnitModel.js'

const UNITS_DATA = [
  {
    name: 'UBS Vila Hortência',
    address: 'Rua Padre Madureira, 100 - Vila Hortência, Sorocaba - SP',
    maxOccupancy: 60,
    phone: '15991234501',
    openingHours: {
      mon: { open: '07:00', close: '19:00' },
      tue: { open: '07:00', close: '19:00' },
      wed: { open: '07:00', close: '19:00' },
      thu: { open: '07:00', close: '19:00' },
      fri: { open: '07:00', close: '19:00' },
      sat: { open: '08:00', close: '12:00' },
      sun: undefined
    }
  },
  {
    name: 'UBS Jardim Vera Cruz',
    address: 'Rua Itapuã, 320 - Jardim Vera Cruz, Sorocaba - SP',
    maxOccupancy: 55,
    phone: '15991234502',
    openingHours: {
      mon: { open: '07:00', close: '19:00' },
      tue: { open: '07:00', close: '19:00' },
      wed: { open: '07:00', close: '19:00' },
      thu: { open: '07:00', close: '19:00' },
      fri: { open: '07:00', close: '19:00' },
      sat: { open: '08:00', close: '12:00' },
      sun: undefined
    }
  },
  {
    name: 'UBS Vila Barão',
    address: 'Rua Florêncio de Abreu, 850 - Vila Barão, Sorocaba - SP',
    maxOccupancy: 50,
    phone: '15991234503',
    openingHours: {
      mon: { open: '08:00', close: '17:00' },
      tue: { open: '08:00', close: '17:00' },
      wed: { open: '08:00', close: '17:00' },
      thu: { open: '08:00', close: '17:00' },
      fri: { open: '08:00', close: '17:00' },
      sat: undefined,
      sun: undefined
    }
  },
  {
    name: 'UBS Éden',
    address: 'Rua Benedito da Silva Prado, 410 - Éden, Sorocaba - SP',
    maxOccupancy: 65,
    phone: '15991234504',
    openingHours: {
      mon: { open: '07:00', close: '19:00' },
      tue: { open: '07:00', close: '19:00' },
      wed: { open: '07:00', close: '19:00' },
      thu: { open: '07:00', close: '19:00' },
      fri: { open: '07:00', close: '19:00' },
      sat: { open: '08:00', close: '12:00' },
      sun: undefined
    }
  },
  {
    name: 'UBS Wanel Ville',
    address: 'Rua Deputado Emílio Carlos, 1200 - Wanel Ville, Sorocaba - SP',
    maxOccupancy: 70,
    phone: '15991234505',
    openingHours: {
      mon: { open: '07:30', close: '17:30' },
      tue: { open: '07:30', close: '17:30' },
      wed: { open: '07:30', close: '17:30' },
      thu: { open: '07:30', close: '17:30' },
      fri: { open: '07:30', close: '17:30' },
      sat: undefined,
      sun: undefined
    }
  },
  {
    name: 'UPA 24h Zona Norte',
    address: 'Av. Independência, 3500 - Jardim Gonçalves, Sorocaba - SP',
    maxOccupancy: 150,
    phone: '15991234506',
    openingHours: {
      mon: { open: '00:00', close: '23:59' },
      tue: { open: '00:00', close: '23:59' },
      wed: { open: '00:00', close: '23:59' },
      thu: { open: '00:00', close: '23:59' },
      fri: { open: '00:00', close: '23:59' },
      sat: { open: '00:00', close: '23:59' },
      sun: { open: '00:00', close: '23:59' }
    }
  },
  {
    name: 'UPA 24h Zona Sul',
    address: 'Rua Oito de Janeiro, 600 - Jardim Pagliato, Sorocaba - SP',
    maxOccupancy: 130,
    phone: '15991234507',
    openingHours: {
      mon: { open: '00:00', close: '23:59' },
      tue: { open: '00:00', close: '23:59' },
      wed: { open: '00:00', close: '23:59' },
      thu: { open: '00:00', close: '23:59' },
      fri: { open: '00:00', close: '23:59' },
      sat: { open: '00:00', close: '23:59' },
      sun: { open: '00:00', close: '23:59' }
    }
  },
  {
    name: 'Hospital Regional de Sorocaba',
    address: 'Av. Antônio Carlos Comitre, 525 - Parque Campolim, Sorocaba - SP',
    maxOccupancy: 350,
    phone: '15991234508',
    openingHours: {
      mon: { open: '00:00', close: '23:59' },
      tue: { open: '00:00', close: '23:59' },
      wed: { open: '00:00', close: '23:59' },
      thu: { open: '00:00', close: '23:59' },
      fri: { open: '00:00', close: '23:59' },
      sat: { open: '00:00', close: '23:59' },
      sun: { open: '00:00', close: '23:59' }
    }
  },
  {
    name: 'Hospital Municipal "Dr. Amâncio Thomé"',
    address: 'Rua Manoel Lopes Queiroz, 355 - Centro, Sorocaba - SP',
    maxOccupancy: 280,
    phone: '15991234509',
    openingHours: {
      mon: { open: '00:00', close: '23:59' },
      tue: { open: '00:00', close: '23:59' },
      wed: { open: '00:00', close: '23:59' },
      thu: { open: '00:00', close: '23:59' },
      fri: { open: '00:00', close: '23:59' },
      sat: { open: '00:00', close: '23:59' },
      sun: { open: '00:00', close: '23:59' }
    }
  },
  {
    name: 'Centro de Especialidades Médicas de Sorocaba',
    address: 'Rua General Carneiro, 729 - Centro, Sorocaba - SP',
    maxOccupancy: 100,
    phone: '15991234510',
    openingHours: {
      mon: { open: '07:00', close: '17:00' },
      tue: { open: '07:00', close: '17:00' },
      wed: { open: '07:00', close: '17:00' },
      thu: { open: '07:00', close: '17:00' },
      fri: { open: '07:00', close: '17:00' },
      sat: undefined,
      sun: undefined
    }
  },
  {
    name: 'UBS Parque São Bento',
    address:
      'Rua Cel. Antônio Ferreira Sampaio, 1540 - Parque São Bento, Sorocaba - SP',
    maxOccupancy: 60,
    phone: '15991234511',
    openingHours: {
      mon: { open: '07:00', close: '19:00' },
      tue: { open: '07:00', close: '19:00' },
      wed: { open: '07:00', close: '19:00' },
      thu: { open: '07:00', close: '19:00' },
      fri: { open: '07:00', close: '19:00' },
      sat: { open: '08:00', close: '12:00' },
      sun: undefined
    }
  },
  {
    name: 'UBS Aparecidinha',
    address: 'Rua José Benedito dos Santos, 80 - Aparecidinha, Sorocaba - SP',
    maxOccupancy: 55,
    phone: '15991234512',
    openingHours: {
      mon: { open: '08:00', close: '17:00' },
      tue: { open: '08:00', close: '17:00' },
      wed: { open: '08:00', close: '17:00' },
      thu: { open: '08:00', close: '17:00' },
      fri: { open: '08:00', close: '17:00' },
      sat: undefined,
      sun: undefined
    }
  }
]

const createUnits = {
  name: 'create-units',
  description: 'Adiciona as unidades de saúde de Sorocaba ao banco de dados',
  async run() {
    console.log(
      `\n🏥 Iniciando seed de ${UNITS_DATA.length} unidades de Sorocaba - SP...\n`
    )

    console.log('❌ Deletando unidades já existentes')
    await Unit.deleteMany()

    console.log('🚀 Criando novas unidades')
    for (let i = 0; i < UNITS_DATA.length; i++) {
      const data = UNITS_DATA[i]
      const unit = await Unit.create(data)
      console.log(`✅ [${i + 1}/${UNITS_DATA.length}] ${unit.name}`)
    }

    console.log(
      `\n🎉 Seed concluído! ${UNITS_DATA.length} unidades cadastradas com sucesso.\n`
    )

    process.exit()
  }
}

export default createUnits
