import type { Icon } from '@phosphor-icons/react'
import styles from './UserDetailsCard.module.scss'

interface IDetailsItemProps {
  label: string
  value?: string
}

function DetailsItem({ label, value }: IDetailsItemProps) {
  return (
    <div className={styles.detailsItem}>
      <span className={styles.label}>{label}</span>
      {value && <span className={styles.value}>{value}</span>}
    </div>
  )
}

interface IUserDetailsCardProps {
  Icon: Icon
  title: string
  itens: IDetailsItemProps[]
}

function UserDetailsCard({ Icon, title, itens }: IUserDetailsCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.cardHeader}>
        <Icon size={22} />
        {title}
      </div>

      {itens.map((item) => (
        <DetailsItem
          key={`${item.label}_${item.value}`}
          label={item.label}
          value={item.value}
        />
      ))}
    </section>
  )
}

export default UserDetailsCard
