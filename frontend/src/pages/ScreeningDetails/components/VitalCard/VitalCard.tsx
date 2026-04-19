import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import { useState } from 'react'
import { InputText } from '@/components/FormComponents/FormComponents'
import styles from './VitalCard.module.scss'

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

  const labelsToMasks = () => {
    switch (label) {
      case 'Temperatura':
        return 'temperature'
      case 'Pressão Arterial':
        return 'bloodPressure'
      default:
        return undefined
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    onChange?.(val)
  }

  return (
    <div className={styles.card}>
      {isNurse ? (
        <InputText
          className={styles.input}
          value={inputValue}
          mask={labelsToMasks()}
          onChange={handleChange}
          placeholder='0'
          suffix={suffix?.trim()}
          style={{
            width: `${Math.max(inputValue.length + 2, 1) + (suffix ? suffix.trim().length : 0)}ch`,
          }}
        />
      ) : (
        <span className={styles.value}>
          {value}{suffix}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default VitalCard
