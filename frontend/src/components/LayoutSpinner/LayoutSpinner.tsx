import styles from './LayoutSpinner.module.scss'

interface ILayoutSpinnerProps {
  className?: string
}

export function LayoutSpinner({ className }: ILayoutSpinnerProps) {
  return (
    <div className={`${styles['layout-spinner']} ${className || ''}`}>
      <div className={styles.progressBar} />
    </div>
  )
}
