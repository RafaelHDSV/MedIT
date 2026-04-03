import { Flex, Tag } from 'antd'
import parentStyles from '../../PreRegistration.module.scss'
import styles from './SymptomsInfo.module.scss'

interface ISymptomsInfoProps {
  selectedSymptoms: string[]
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<string[]>>
}

function SymptomsInfo({
  selectedSymptoms,
  setSelectedSymptoms
}: ISymptomsInfoProps) {
  // VIEIRA: Adicionar dinâmico
  const symptoms = [
    'Febre',
    'Dor de cabeça',
    'Dor no corpo',
    'Tosse',
    'Náusea',
    'Fadiga',
    'Dor de garganta',
    'Calafrios',
    'Falta de ar',
    'Dor abdominal',
    'Diarreia',
    'Vômito',
    'Confusão mental',
    'Perda de olfato/paladar',
    'Erupção cutânea',
    'Inchaço',
    'Dificuldade para dormir',
    'Ansiedade',
    'Depressão'
  ]

  const handleSelectSymptoms = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  return (
    <div className={parentStyles.formContainer}>
      <h3 className={parentStyles.sectionTitle}>Sintomas</h3>

      <Flex wrap='wrap' gap={8}>
        {symptoms.map((symptom) => (
          <Tag
            key={symptom}
            onClick={() => handleSelectSymptoms(symptom)}
            className={`${styles.symptomTag} ${selectedSymptoms.includes(symptom) ? styles.selected : ''}`}
          >
            {symptom}
          </Tag>
        ))}
      </Flex>
    </div>
  )
}

export default SymptomsInfo
