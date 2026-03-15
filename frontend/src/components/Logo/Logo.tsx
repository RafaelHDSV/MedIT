import styles from './Logo.module.scss'

interface ILogoProps {
  fontSize?: number
}

function Logo({ fontSize = 42 }: ILogoProps) {
  return (
    <div className={styles.title} style={{ fontSize }}>
      <strong>Med</strong>
      <span>Flow</span>
    </div>
  )
}

export default Logo
