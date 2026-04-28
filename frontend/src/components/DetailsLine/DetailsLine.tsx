import { Tooltip } from 'antd'
import type { ObjectId } from 'mongoose'
import type React from 'react'
import styles from './DetailsLine.module.scss'

export interface IDetailsLineProps {
  key?: ObjectId | string | undefined
  label: string
  value: string | number | React.ReactElement | undefined
  checked?: boolean
}

function DetailsLine({ label, value, checked }: IDetailsLineProps) {
  const isObject = typeof value === 'object'
  const displayValue = value ?? '-'

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.value}>
        {isObject ? (
          <>
            {value}
            {checked && '✅'}
          </>
        ) : (
          <Tooltip title={String(displayValue)}>
            <span className={styles.tooltipTrigger}>
              <span className={styles.truncate}>{displayValue}</span>
              {checked && '✅'}
            </span>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

export default DetailsLine
