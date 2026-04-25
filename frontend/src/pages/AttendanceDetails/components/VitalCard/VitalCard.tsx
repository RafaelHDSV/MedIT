import { InputText } from '@/components/FormComponents/FormComponents'
import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import styles from './VitalCard.module.scss'

interface IVitalCard {
  value: string | number
  label: string
  suffix?: string
  onChange?: (value: string) => void
}

function VitalCard({ value, label, suffix, onChange }: IVitalCard) {
  const { user } = useAuth()
  const stringValue =
    value !== undefined && value !== null && value !== '—' ? String(value) : ''
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
    onChange?.(e.target.value)
  }

  return (
    <div className={styles.card}>
      {canEditVital ? (
        <InputText
          className={styles.input}
          value={stringValue}
          mask={labelsToMasks()}
          onChange={handleChange}
          placeholder='0'
          suffix={suffix}
          style={{
            width: `${Math.max(stringValue.length + 2, 1) + (suffix ? suffix.length : 0)}ch`
          }}
        />
      ) : (
        <span className={styles.value}>
          {stringValue !== '' ? stringValue : '—'}
          {suffix}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default VitalCard
