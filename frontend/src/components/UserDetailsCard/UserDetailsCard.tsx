import type { Icon } from '@phosphor-icons/react'
import { Skeleton } from 'antd'
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
  useFullWidth?: boolean
  Icon: Icon
  title: string
  itens: IDetailsItemProps[]
  loading?: boolean
}

function UserDetailsCard({
  useFullWidth = false,
  Icon,
  title,
  itens,
  loading = false
}: IUserDetailsCardProps) {
  if (loading) {
    return (
      <section className={styles.card}>
        <Skeleton active title={false} paragraph={{ rows: 1 }} />

        {itens.map(() => (
          <Skeleton.Button className={styles.itemSkeleton} active />
        ))}
      </section>
    )
  }

  return (
    <section className={`${styles.card} ${useFullWidth ? styles.fullWidth : ''}`}>
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
