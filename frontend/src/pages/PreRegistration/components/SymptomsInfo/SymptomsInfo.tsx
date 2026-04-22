import SymptomTag from '@/components/SymptomTag/SymptomTag'
import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import { Flex } from 'antd'
import parentStyles from '../../PreRegistration.module.scss'

interface ISymptomsInfoProps {
  options: ISymptomOption[]
  selectedSymptoms: string[]
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<string[]>>
}

function SymptomsInfo({
  options,
  selectedSymptoms,
  setSelectedSymptoms
}: ISymptomsInfoProps) {
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
        {options.map(({ key, label }) => (
          <SymptomTag
            key={key}
            symptom={label}
            clickable
            selected={selectedSymptoms.includes(key)}
            onClick={() => handleSelectSymptoms(key)}
          />
        ))}
      </Flex>
    </div>
  )
}

export default SymptomsInfo
