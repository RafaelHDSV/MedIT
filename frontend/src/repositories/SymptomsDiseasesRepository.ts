import { api } from '@/api/api'
import type {
  IDiseaseOption,
  ISymptomOption
} from '@/interfaces/ISymptomDiseases'
import { Repository } from './Repository'

class SymptomsDiseasesRepository extends Repository {
  async getSymptomOptions() {
    return this.handle(() => {
      return this.api.get<{ data: { symptoms: ISymptomOption[] } }>(
        `${this.path}/symptom-options`
      )
    })
  }

  async getDiseaseOptions() {
    return this.handle(() => {
      return this.api.get<{ data: { diseases: IDiseaseOption[] } }>(
        `${this.path}/disease-options`
      )
    })
  }
}

export default new SymptomsDiseasesRepository({
  path: '/auth/symptoms-diseases',
  api
})
