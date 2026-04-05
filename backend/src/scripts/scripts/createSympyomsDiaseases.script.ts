import { ISympyomsDiseases } from '../../interfaces/ISympyomsDiseases.js'
import SympyomsDiseasesModel from '../../models/SympyomsDiseasesModel.js'

const createSympyomsDiaseases = {
  disease: 'create-sympyoms-diaseases',
  description: 'Cria doenças com seus sintomas, simulando IA',
  async run() {
    console.log('🚀 Criando condições médicas...')

    const sympyomsDiseases: ISympyomsDiseases[] = [
      {
        disease: 'Gripe (Influenza)',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 1,
          doresMuscular: 1,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 1,
          dorsGarganta: 1,
          corrizaNasal: 1,
          espirros: 1,
          faltaDeAr: 0,
          nauseaVomito: 0,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Resfriado Comum',
        symptoms: {
          febre: 0,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 0,
          doresCabeca: 1,
          tosseSeca: 1,
          dorsGarganta: 1,
          corrizaNasal: 1,
          espirros: 1,
          faltaDeAr: 0,
          nauseaVomito: 0,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'COVID-19',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 1,
          doresMuscular: 1,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 1,
          dorsGarganta: 1,
          corrizaNasal: 1,
          espirros: 0,
          faltaDeAr: 1,
          nauseaVomito: 1,
          diarreia: 1,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 1,
          confusaoMental: 1,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Pneumonia',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 1,
          doresMuscular: 1,
          fadiga: 1,
          doresCabeca: 0,
          tosseSeca: 1,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 1,
          nauseaVomito: 1,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 1,
          confusaoMental: 1,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Gastroenterite',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 0,
          nauseaVomito: 1,
          diarreia: 1,
          dorAbdominal: 1,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Apendicite',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 0,
          doresCabeca: 0,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 0,
          nauseaVomito: 1,
          diarreia: 0,
          dorAbdominal: 1,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Meningite',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 1,
          doresMuscular: 1,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 0,
          nauseaVomito: 1,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 1,
          dorPeito: 0,
          confusaoMental: 1,
          rigidezNuca: 1,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Infarto Agudo do Miocárdio',
        symptoms: {
          febre: 0,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 1,
          doresCabeca: 0,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 1,
          nauseaVomito: 1,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 1,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'AVC (Acidente Vascular Cerebral)',
        symptoms: {
          febre: 0,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 0,
          nauseaVomito: 1,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 1,
          rigidezNuca: 1,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Dengue',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 1,
          doresMuscular: 1,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 0,
          nauseaVomito: 1,
          diarreia: 0,
          dorAbdominal: 1,
          erupcaoCutanea: 1,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 1,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Hepatite A',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 0,
          doresMuscular: 1,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 0,
          nauseaVomito: 1,
          diarreia: 1,
          dorAbdominal: 1,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 1,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Artrite Reumatoide',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 0,
          doresMuscular: 1,
          fadiga: 1,
          doresCabeca: 0,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 0,
          nauseaVomito: 0,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 1
        }
      },
      {
        disease: 'Crise Asmática',
        symptoms: {
          febre: 0,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 1,
          doresCabeca: 0,
          tosseSeca: 1,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 1,
          faltaDeAr: 1,
          nauseaVomito: 0,
          diarreia: 0,
          dorAbdominal: 0,
          erupcaoCutanea: 0,
          dorPeito: 1,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Diabetes (Crise Hiperglicêmica)',
        symptoms: {
          febre: 0,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 1,
          doresCabeca: 1,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 1,
          nauseaVomito: 1,
          diarreia: 0,
          dorAbdominal: 1,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 1,
          rigidezNuca: 0,
          ictericia: 0,
          sangramento: 0,
          inchacoArticular: 0
        }
      },
      {
        disease: 'Pancreatite',
        symptoms: {
          febre: 1,
          calafrioIntensidade: 0,
          doresMuscular: 0,
          fadiga: 1,
          doresCabeca: 0,
          tosseSeca: 0,
          dorsGarganta: 0,
          corrizaNasal: 0,
          espirros: 0,
          faltaDeAr: 1,
          nauseaVomito: 1,
          diarreia: 1,
          dorAbdominal: 1,
          erupcaoCutanea: 0,
          dorPeito: 0,
          confusaoMental: 0,
          rigidezNuca: 0,
          ictericia: 1,
          sangramento: 0,
          inchacoArticular: 0
        }
      }
    ]

    await SympyomsDiseasesModel.deleteMany()
    await SympyomsDiseasesModel.insertMany(sympyomsDiseases)

    console.log(
      `✅ ${sympyomsDiseases.length} condições inseridas com sucesso!`
    )

    process.exit()
  }
}

export default createSympyomsDiaseases
