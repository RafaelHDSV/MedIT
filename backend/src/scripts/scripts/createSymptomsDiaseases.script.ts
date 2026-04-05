import { ISymptomsDiseases } from '../../interfaces/ISymptomsDiseases.js'
import SymptomsDiseasesModel from '../../models/SymptomsDiseasesModel.js'

const createSymptomsDiseases = {
  disease: 'create-symptoms-diseases',
  description: 'Cria doenças com seus sintomas (IA simulada)',
  async run() {
    console.log('🚀 Criando condições médicas...')

    const diseases: ISymptomsDiseases[] = [
      {
        disease: 'Influenza',
        symptoms: {
          fever: 1,
          chills: 1,
          musclePain: 1,
          fatigue: 1,
          headache: 1,
          dryCough: 1,
          soreThroat: 1,
          runnyNose: 1,
          sneezing: 1,
          shortnessOfBreath: 0,
          nauseaVomiting: 0,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 0,
          chestPain: 0,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Common Cold',
        symptoms: {
          fever: 0,
          chills: 0,
          musclePain: 0,
          fatigue: 0,
          headache: 1,
          dryCough: 1,
          soreThroat: 1,
          runnyNose: 1,
          sneezing: 1,
          shortnessOfBreath: 0,
          nauseaVomiting: 0,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 0,
          chestPain: 0,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'COVID-19',
        symptoms: {
          fever: 1,
          chills: 1,
          musclePain: 1,
          fatigue: 1,
          headache: 1,
          dryCough: 1,
          soreThroat: 1,
          runnyNose: 1,
          sneezing: 0,
          shortnessOfBreath: 1,
          nauseaVomiting: 1,
          diarrhea: 1,
          abdominalPain: 0,
          skinRash: 0,
          chestPain: 1,
          mentalConfusion: 1,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Pneumonia',
        symptoms: {
          fever: 1,
          chills: 1,
          musclePain: 1,
          fatigue: 1,
          headache: 0,
          dryCough: 1,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 1,
          nauseaVomiting: 0,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 0,
          chestPain: 1,
          mentalConfusion: 1,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Gastroenteritis',
        symptoms: {
          fever: 1,
          chills: 0,
          musclePain: 0,
          fatigue: 1,
          headache: 1,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 0,
          nauseaVomiting: 1,
          diarrhea: 1,
          abdominalPain: 1,
          skinRash: 0,
          chestPain: 0,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Appendicitis',
        symptoms: {
          fever: 1,
          chills: 0,
          musclePain: 0,
          fatigue: 0,
          headache: 0,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 0,
          nauseaVomiting: 1,
          diarrhea: 0,
          abdominalPain: 1,
          skinRash: 0,
          chestPain: 0,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Meningitis',
        symptoms: {
          fever: 1,
          chills: 1,
          musclePain: 1,
          fatigue: 1,
          headache: 1,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 0,
          nauseaVomiting: 1,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 1,
          chestPain: 0,
          mentalConfusion: 1,
          neckStiffness: 1,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Myocardial Infarction',
        symptoms: {
          fever: 0,
          chills: 0,
          musclePain: 0,
          fatigue: 1,
          headache: 0,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 1,
          nauseaVomiting: 1,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 0,
          chestPain: 1,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Stroke',
        symptoms: {
          fever: 0,
          chills: 0,
          musclePain: 0,
          fatigue: 1,
          headache: 1,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 0,
          nauseaVomiting: 1,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 0,
          chestPain: 0,
          mentalConfusion: 1,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Sepsis',
        symptoms: {
          fever: 1,
          chills: 1,
          musclePain: 1,
          fatigue: 1,
          headache: 1,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 1,
          nauseaVomiting: 1,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 1,
          chestPain: 0,
          mentalConfusion: 1,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 1,
          jointSwelling: 0
        }
      },
      {
        disease: 'Migraine',
        symptoms: {
          fever: 0,
          chills: 0,
          musclePain: 0,
          fatigue: 1,
          headache: 1,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 0,
          nauseaVomiting: 1,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 0,
          chestPain: 0,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Urinary Tract Infection',
        symptoms: {
          fever: 1,
          chills: 0,
          musclePain: 0,
          fatigue: 1,
          headache: 0,
          dryCough: 0,
          soreThroat: 0,
          runnyNose: 0,
          sneezing: 0,
          shortnessOfBreath: 0,
          nauseaVomiting: 0,
          diarrhea: 0,
          abdominalPain: 1,
          skinRash: 0,
          chestPain: 0,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      },
      {
        disease: 'Allergic Reaction',
        symptoms: {
          fever: 0,
          chills: 0,
          musclePain: 0,
          fatigue: 0,
          headache: 0,
          dryCough: 1,
          soreThroat: 0,
          runnyNose: 1,
          sneezing: 1,
          shortnessOfBreath: 1,
          nauseaVomiting: 0,
          diarrhea: 0,
          abdominalPain: 0,
          skinRash: 1,
          chestPain: 0,
          mentalConfusion: 0,
          neckStiffness: 0,
          jaundice: 0,
          bleeding: 0,
          jointSwelling: 0
        }
      }
    ]

    await SymptomsDiseasesModel.deleteMany()
    await SymptomsDiseasesModel.insertMany(diseases)

    console.log(`✅ ${diseases.length} doenças inseridas com sucesso!`)
    process.exit()
  }
}

export default createSymptomsDiseases
