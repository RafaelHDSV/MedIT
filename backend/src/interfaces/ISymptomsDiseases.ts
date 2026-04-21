import { IBaseInterface } from './IBaseInterface.js'

export interface ISymptomsDiseases extends IBaseInterface {
  disease: string
  symptoms: Record<string, number>
}

export interface ISymptomOption {
  key: string
  label: string
}

export interface ISuggestedDiseases {
  disease: string
  compatibility: number
}

export interface ISuggestedDiseasesPayload {
  suggestions: ISuggestedDiseases[]
  normalizedSymptomKeys: string[]
  reportedSymptoms: string[]
}

export interface ISuggestionDetails extends ISuggestedDiseases {
  reportedSymptomKeys: string[]
  referenceSymptomKeys: string[]
  matchedReferenceCount: number
  referenceSymptomCount: number
}

/**
 * Normaliza rótulos de sintomas (PT-BR da UI, aliases) para as chaves camelCase
 * usadas em `SymptomsDisease.symptoms` e no CSV exportado.
 */
export const DISEASE_SYMPTOM_KEYS = [
  'fever',
  'chills',
  'musclePain',
  'fatigue',
  'headache',
  'dryCough',
  'soreThroat',
  'runnyNose',
  'sneezing',
  'shortnessOfBreath',
  'nauseaVomiting',
  'diarrhea',
  'abdominalPain',
  'skinRash',
  'chestPain',
  'mentalConfusion',
  'neckStiffness',
  'jaundice',
  'bleeding',
  'jointSwelling',
  'lossOfTasteSmell',
  'dizziness',
  'coughWithPhlegm',
  'wheezing',
  'burningUrination',
  'frequentUrination',
  'thirst',
  'blurredVision',
  'backPain',
  'weightLoss',
  'swollenLymphNodes',
  'nightSweats',
  'palpitations',
  'legPain',
  'numbness',
  'eyeRedness',
  'earPain',
  'itching',
  'excessiveSweating',
  'lossOfAppetite'
] as const
export type DiseaseSymptomKey = (typeof DISEASE_SYMPTOM_KEYS)[number]
export const DISEASE_KEY_SET = new Set<string>(DISEASE_SYMPTOM_KEYS)

/** PT e aliases (minúsculas) → chave */
export const PT_LOWER_TO_DISEASE_KEY: Record<string, DiseaseSymptomKey> = {
  febre: 'fever',
  calafrios: 'chills',
  'dor no corpo': 'musclePain',
  'dor muscular': 'musclePain',
  fadiga: 'fatigue',
  'dor de cabeça': 'headache',
  tosse: 'dryCough',
  'tosse seca': 'dryCough',
  'dor de garganta': 'soreThroat',
  'nariz entupido': 'runnyNose',
  coriza: 'runnyNose',
  espirros: 'sneezing',
  espirro: 'sneezing',
  'falta de ar': 'shortnessOfBreath',
  náusea: 'nauseaVomiting',
  nausea: 'nauseaVomiting',
  vômito: 'nauseaVomiting',
  vomito: 'nauseaVomiting',
  'náusea ou vômito': 'nauseaVomiting',
  diarreia: 'diarrhea',
  'dor abdominal': 'abdominalPain',
  'erupção cutânea': 'skinRash',
  'confusão mental': 'mentalConfusion',
  'perda de olfato/paladar': 'lossOfTasteSmell',
  'perda de olfato': 'lossOfTasteSmell',
  'perda de paladar': 'lossOfTasteSmell',
  inchaço: 'jointSwelling',
  'dor no peito': 'chestPain',
  'rigidez de nuca': 'neckStiffness',
  icterícia: 'jaundice',
  sangramento: 'bleeding',
  tontura: 'dizziness',
  'tosse com catarro': 'coughWithPhlegm',
  chiado: 'wheezing',
  'ardor ao urinar': 'burningUrination',
  'micção frequente': 'frequentUrination',
  sede: 'thirst',
  'visão turva': 'blurredVision',
  'dor nas costas': 'backPain',
  'perda de peso': 'weightLoss',
  'linfonodos inchados': 'swollenLymphNodes',
  'suor noturno': 'nightSweats',
  palpitações: 'palpitations',
  palpitacoes: 'palpitations',
  'dor na perna': 'legPain',
  dormência: 'numbness',
  'olhos vermelhos': 'eyeRedness',
  'dor de ouvido': 'earPain',
  coceira: 'itching',
  'suor excessivo': 'excessiveSweating',
  'perda de apetite': 'lossOfAppetite'
}

export const SYMPTOM_LABEL_PT: Record<DiseaseSymptomKey, string> = {
  fever: 'Febre',
  chills: 'Calafrios',
  musclePain: 'Dor no corpo',
  fatigue: 'Fadiga',
  headache: 'Dor de cabeça',
  dryCough: 'Tosse seca',
  soreThroat: 'Dor de garganta',
  runnyNose: 'Coriza',
  sneezing: 'Espirros',
  shortnessOfBreath: 'Falta de ar',
  nauseaVomiting: 'Náusea ou vômito',
  diarrhea: 'Diarreia',
  abdominalPain: 'Dor abdominal',
  skinRash: 'Erupção cutânea',
  chestPain: 'Dor no peito',
  mentalConfusion: 'Confusão mental',
  neckStiffness: 'Rigidez de nuca',
  jaundice: 'Icterícia',
  bleeding: 'Sangramento',
  jointSwelling: 'Inchaço articular',
  lossOfTasteSmell: 'Perda de olfato/paladar',
  dizziness: 'Tontura',
  coughWithPhlegm: 'Tosse com catarro',
  wheezing: 'Chiado no peito',
  burningUrination: 'Ardor ao urinar',
  frequentUrination: 'Micção frequente',
  thirst: 'Sede intensa',
  blurredVision: 'Visão turva',
  backPain: 'Dor nas costas',
  weightLoss: 'Perda de peso',
  swollenLymphNodes: 'Linfonodos inchados',
  nightSweats: 'Sudorese noturna',
  palpitations: 'Palpitações',
  legPain: 'Dor nas pernas',
  numbness: 'Dormência',
  eyeRedness: 'Olhos vermelhos',
  earPain: 'Dor de ouvido',
  itching: 'Coceira',
  excessiveSweating: 'Suor excessivo',
  lossOfAppetite: 'Perda de apetite'
}

/** Rótulos exatos usados na UI de pré-atendimento (mantêm capitalização) */
export const EXACT_UI_LABEL_TO_DISEASE_KEY: Record<string, DiseaseSymptomKey> = {
  Febre: 'fever',
  'Dor de cabeça': 'headache',
  'Dor no corpo': 'musclePain',
  Tosse: 'dryCough',
  Náusea: 'nauseaVomiting',
  Fadiga: 'fatigue',
  'Dor de garganta': 'soreThroat',
  Calafrios: 'chills',
  'Falta de ar': 'shortnessOfBreath',
  'Dor abdominal': 'abdominalPain',
  Diarreia: 'diarrhea',
  Vômito: 'nauseaVomiting',
  'Náusea ou vômito': 'nauseaVomiting',
  'Tosse seca': 'dryCough',
  'Confusão mental': 'mentalConfusion',
  'Perda de olfato/paladar': 'lossOfTasteSmell',
  'Erupção cutânea': 'skinRash',
  Inchaço: 'jointSwelling'
}
