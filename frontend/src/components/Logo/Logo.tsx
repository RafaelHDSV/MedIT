import styles from './Logo.module.scss'

interface ILogoProps {
  className?: string
  fontSize?: number
  isCompact?: boolean
}

function Logo({ className, fontSize = 36, isCompact = false }: ILogoProps) {
  if (isCompact) {
    return (
      <div className={`${styles.title} ${className}`} style={{ fontSize }}>
        <strong>M</strong>
        <span>F</span>
      </div>
    )
  }

  return (
    <div className={`${styles.title} ${className}`} style={{ fontSize }}>
      <strong>Med</strong>
      <span>Flow</span>
    </div>
  )
}

export default Logo
