import { Flex } from 'antd'
import SymptomTag from '@/components/SymptomTag/SymptomTag'
import parentStyles from '../../PreRegistration.module.scss'

interface ISymptomsInfoProps {
  selectedSymptoms: string[]
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<string[]>>
}

function SymptomsInfo({
  selectedSymptoms,
  setSelectedSymptoms
}: ISymptomsInfoProps) {
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
          <SymptomTag
            key={symptom}
            symptom={symptom}
            clickable
            selected={selectedSymptoms.includes(symptom)}
            onClick={() => handleSelectSymptoms(symptom)}
          />
        ))}
      </Flex>
    </div>
  )
}

export default SymptomsInfo