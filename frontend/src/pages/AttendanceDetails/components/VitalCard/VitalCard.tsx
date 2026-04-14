import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import { useState } from 'react'
import styles from './VitalCard.module.scss'
import { InputText } from '@/components/FormComponents/FormComponents'

interface IVitalCard {
  value: string | number
  label: string
  suffix?: string
  onChange?: (value: string) => void
}

function VitalCard({ value, label, suffix, onChange }: IVitalCard) {
  const { user } = useAuth()
  const [inputValue, setInputValue] = useState(String(value))
  const isNurse = user?.level === UserLevels.NURSE
  const canEditVital = isNurse

  const labelsToMasks = () => {
    switch (label) {
      case 'Temperatura':
        return 'temperature'
      case 'Pressão Arterial':
        return 'bloodPressure'
      default:
        return
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    onChange?.(value)
  }

  return (
    <div className={styles.card}>
      {canEditVital ? (
        <InputText
          className={styles.input}
          value={inputValue}
          mask={labelsToMasks()}
          onChange={handleChange}
          placeholder='0'
          suffix={suffix}
          style={{
            width: `${Math.max(inputValue.length + 2, 1) + (suffix ? suffix.length : 0)}ch`
          }}
        />
      ) : (
        <span className={styles.value}>
          {value}
          {suffix}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default VitalCard
