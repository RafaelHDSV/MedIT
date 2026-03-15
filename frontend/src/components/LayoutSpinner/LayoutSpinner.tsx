import { Spin, type SpinProps } from 'antd'
import styles from './LayoutSpinner.module.scss'

export function LayoutSpinner({
  className,
  size,
  ...props
}: Partial<SpinProps>) {
  return (
    <Spin
      className={`${styles['layout-spinner']} ${className || ''}`}
      size={size || 'large'}
      {...props}
    />
  )
}
