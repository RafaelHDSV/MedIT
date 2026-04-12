import { UpdateQuery } from 'mongoose'
import { Unit } from '../../models/UnitModel.js'
import { Script } from '../types.js'

// Helpers de horário
const hours = (open: string, close: string) => ({ open, close })
const h24 = () => hours('00:00', '23:59')
const closed = null

interface UnitFix {
  id: string
  label: string
  name?: string
  address: {
    street: string
    number: number
    neighborhood: string
    city: string
    state: string
    zipCode: number
  }
  openingHours: {
    mon: { open: string; close: string } | null
    tue: { open: string; close: string } | null
    wed: { open: string; close: string } | null
    thu: { open: string; close: string } | null
    fri: { open: string; close: string } | null
    sat: { open: string; close: string } | null
    sun: { open: string; close: string } | null
  }
}

const fixes: UnitFix[] = [
  {
    id: '69d2981909395bf057e050e6',
    label: 'UBS Vila Hortência',
    name: 'CS Vila Hortência Sorocaba',
    address: {
      street: 'Rua Teodoro Kaisel',
      number: 100,
      neighborhood: 'Vila Hortência',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18020268
    },
    openingHours: {
      mon: hours('07:00', '19:00'),
      tue: hours('07:00', '19:00'),
      wed: hours('07:00', '19:00'),
      thu: hours('07:00', '19:00'),
      fri: hours('07:00', '19:00'),
      sat: closed,
      sun: closed
    }
  },
  {
    id: '69d2981909395bf057e050ee',
    label: 'UBS Márcia Mendes',
    address: {
      street: 'Rua José Augusto Rabello Júnior',
      number: 91,
      neighborhood: 'Jardim Vera Cruz',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18050180
    },
    openingHours: {
      mon: hours('07:00', '19:00'),
      tue: hours('07:00', '19:00'),
      wed: hours('07:00', '19:00'),
      thu: hours('07:00', '19:00'),
      fri: hours('07:00', '19:00'),
      sat: closed,
      sun: closed
    }
  },
  {
    id: '69d2981909395bf057e050f6',
    label: 'UBS Vila Barão',
    name: 'USF Vila Barão',
    address: {
      street: 'Rua Afonso Muraro',
      number: 41,
      neighborhood: 'Vila Barão',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18061250
    },
    openingHours: {
      mon: hours('07:00', '17:00'),
      tue: hours('07:00', '17:00'),
      wed: hours('07:00', '17:00'),
      thu: hours('07:00', '17:00'),
      fri: hours('07:00', '17:00'),
      sat: closed,
      sun: closed
    }
  },
  {
    id: '69d2981909395bf057e050fd',
    label: 'UBS Éden',
    address: {
      street: 'Rua Salvador Leite Marques',
      number: 933,
      neighborhood: 'Éden',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18103050
    },
    openingHours: {
      mon: hours('07:00', '19:00'),
      tue: hours('07:00', '19:00'),
      wed: hours('07:00', '19:00'),
      thu: hours('07:00', '19:00'),
      fri: hours('07:00', '19:00'),
      sat: closed,
      sun: closed
    }
  },
  {
    id: '69d2981909395bf057e05105',
    label: 'UBS Wanel Ville',
    address: {
      street: 'Rua Alexandre Caldini',
      number: 442,
      neighborhood: 'Parque Ouro Fino',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18055710
    },
    openingHours: {
      mon: hours('07:00', '17:00'),
      tue: hours('07:00', '17:00'),
      wed: hours('07:00', '17:00'),
      thu: hours('07:00', '17:00'),
      fri: hours('07:00', '17:00'),
      sat: closed,
      sun: closed
    }
  },
  {
    id: '69d2981909395bf057e0510c',
    label: 'UPA 24h Zona Norte',
    name: 'UPH 24h Zona Norte',
    address: {
      street: 'Avenida Itavuvu',
      number: 19,
      neighborhood: 'Vila Olímpia',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18075042
    },
    openingHours: {
      mon: h24(),
      tue: h24(),
      wed: h24(),
      thu: h24(),
      fri: h24(),
      sat: h24(),
      sun: h24()
    }
  },
  {
    id: '69d2981909395bf057e05115',
    label: 'UPA 24h Zona Sul',
    name: 'UPH 24h Zona Sul',
    address: {
      street: 'Rua Cel. Nogueira Padilha',
      number: 2585,
      neighborhood: 'Vila Hortência',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18020003
    },
    openingHours: {
      mon: h24(),
      tue: h24(),
      wed: h24(),
      thu: h24(),
      fri: h24(),
      sat: h24(),
      sun: h24()
    }
  },
  {
    id: '69d2981909395bf057e0511e',
    label: 'Hospital Regional de Sorocaba',
    address: {
      street: 'Rodovia Raposo Tavares',
      number: 106,
      neighborhood: 'Parque Reserva Fazenda Imperial',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18052775
    },
    openingHours: {
      mon: h24(),
      tue: h24(),
      wed: h24(),
      thu: h24(),
      fri: h24(),
      sat: h24(),
      sun: h24()
    }
  },
  {
    // Unidade inexistente — substituída por Amhemed Sorocaba
    id: '69d2981909395bf057e05127',
    label: 'Hospital Municipal "Dr. Amâncio Thomé"',
    name: 'Amhemed Sorocaba',
    address: {
      street: 'Rua Pedro José Senger',
      number: 223,
      neighborhood: 'Vila Haro',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18015000
    },
    openingHours: {
      mon: h24(),
      tue: h24(),
      wed: h24(),
      thu: h24(),
      fri: h24(),
      sat: h24(),
      sun: h24()
    }
  },
  {
    id: '69d2981909395bf057e05130',
    label: 'Centro de Especialidades Médicas de Sorocaba',
    address: {
      street: 'Avenida Pres. Juscelino Kubitscheck de Oliveira',
      number: 768,
      neighborhood: 'Centro',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18031480
    },
    openingHours: {
      mon: hours('06:00', '18:00'),
      tue: hours('06:00', '18:00'),
      wed: hours('06:00', '18:00'),
      thu: hours('06:00', '18:00'),
      fri: hours('06:00', '18:00'),
      sat: hours('06:00', '12:00'),
      sun: closed
    }
  },
  {
    id: '69d2981909395bf057e05137',
    label: 'UBS Parque São Bento',
    address: {
      street: 'Avenida Dr. Gualberto Moreira',
      number: 4985,
      neighborhood: 'Parque São Bento',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18072120
    },
    openingHours: {
      mon: h24(),
      tue: h24(),
      wed: h24(),
      thu: h24(),
      fri: h24(),
      sat: h24(),
      sun: h24()
    }
  },
  {
    id: '69d2981909395bf057e0513f',
    label: 'UBS Aparecidinha',
    address: {
      street: 'Rua Joaquim Machado',
      number: 680,
      neighborhood: 'Aparecidinha',
      city: 'Sorocaba',
      state: 'SP',
      zipCode: 18087280
    },
    openingHours: {
      mon: h24(),
      tue: h24(),
      wed: hours('07:00', '23:59'),
      thu: h24(),
      fri: hours('07:00', '23:59'),
      // Sáb/Dom têm duas janelas (00:00–07:00 e 19:00–00:00); o schema suporta
      // apenas uma — armazenando a janela noturna principal (19:00–23:59).
      // TODO: migrar schema para suportar múltiplas janelas por dia.
      sat: hours('19:00', '23:59'),
      sun: hours('19:00', '23:59')
    }
  }
]

const fixUnitsData: Script = {
  name: 'fix-units-data',
  description: 'Corrige nome, endereço e horários das unidades',
  async run() {
    console.log(`Iniciando correção de ${fixes.length} unidades...\n`)

    for (const fix of fixes) {
      console.log(`Atualizando: ${fix.label}`)

      const update: Record<string, unknown> = {
        address: fix.address,
        openingHours: fix.openingHours
      }

      if (fix.name) {
        update.name = fix.name
        console.log(`  Nome → ${fix.name}`)
      }

      console.log(
        `  Endereço → ${fix.address.street}, ${fix.address.number} - ${fix.address.neighborhood}, ${fix.address.city} - ${fix.address.state}, ${fix.address.zipCode}`
      )

      const result = await Unit.findByIdAndUpdate(
        fix.id,
        { $set: update as UpdateQuery<typeof Unit> },
        { new: false }
      )

      if (!result) {
        console.log(`  ⚠️  Nenhum documento encontrado com id ${fix.id}`)
      } else {
        console.log(`  ✅ Atualizado com sucesso`)
      }

      console.log()
    }

    console.log('Correção finalizada')
    process.exit(0)
  }
}

export default fixUnitsData
