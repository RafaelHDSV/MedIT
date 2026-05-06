import { InputText } from '@/components/FormComponents/FormComponents'
import { useAuth } from '@/hooks/useAuth'
import type { VitalFieldDraft } from '@/interfaces/IAttendance'
import { UserLevels } from '@/interfaces/IUser'
import masks, { type MaskEnum } from '@/utils/masks'
import styles from './VitalCard.module.scss'

export type VitalCardField = keyof VitalFieldDraft

interface IVitalCard {
  field: VitalCardField
  value: string | number
  label: string
  suffix?: string
  onChange?: (value: string) => void
}

function VitalCard({ field, value, label, suffix, onChange }: IVitalCard) {
  const { user } = useAuth()
  const stringValue =
    value !== undefined && value !== null && value !== '—' ? String(value) : ''
  const isNurse = user?.level === UserLevels.NURSE
  const canEditVital = isNurse

  const maskType = field as MaskEnum

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = maskType
      ? masks(e.target.value, maskType) || e.target.value
      : e.target.value

    onChange?.(nextValue)
  }

  return (
    <div className={styles.card}>
      {canEditVital ? (
        <InputText
          className={styles.input}
          value={stringValue}
          mask={maskType}
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
