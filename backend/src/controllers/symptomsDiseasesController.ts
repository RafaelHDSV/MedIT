import { Request, Response } from 'express'
import {
  DiseaseSymptomKey,
  SYMPTOM_LABEL_PT
} from '../interfaces/ISymptomsDiseases.js'
import SymptomsDiseasesModel from '../models/SymptomsDiseasesModel.js'
import { diseaseSymptomsToRecord } from '../services/symptomsDiseaseSuggestionService.js'

export const getSymptomOptions = async (_req: Request, res: Response) => {
  function symptomLabelPt(key: string): string {
    const diseaseKey = key as DiseaseSymptomKey
    return SYMPTOM_LABEL_PT[diseaseKey] ?? key
  }

  try {
    const rows = await SymptomsDiseasesModel.find().select('symptoms').lean()

    const keySet = new Set<string>()
    for (const row of rows) {
      const rec = diseaseSymptomsToRecord(row.symptoms)
      for (const k of Object.keys(rec)) {
        keySet.add(k)
      }
    }

    const keys = [...keySet].sort((a, b) => a.localeCompare(b))
    const symptoms = keys.map((key) => ({
      key,
      label: symptomLabelPt(key)
    }))

    return res.status(200).json({
      message: 'Sintomas disponíveis na base sintoma–doença.',
      data: { symptoms }
    })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ message: 'Erro ao listar sintomas da base de dados.' })
  }
}
