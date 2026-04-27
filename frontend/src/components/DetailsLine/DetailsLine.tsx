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

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <Tooltip title={!isObject ? String(value) : ''}>
        <span className={`${styles.value} ${!isObject ? 'ellipsis' : ''}`}>
          {value}
        </span>
        {checked && '✅'}
      </Tooltip>
    </div>
  )
}

export default DetailsLine
