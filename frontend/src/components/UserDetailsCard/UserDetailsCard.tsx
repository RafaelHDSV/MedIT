import type { Icon } from '@phosphor-icons/react'
import { Skeleton } from 'antd'
import type { IDetailsLineProps } from '../DetailsLine/DetailsLine'
import DetailsLine from '../DetailsLine/DetailsLine'
import styles from './UserDetailsCard.module.scss'

interface IUserDetailsCardProps {
  Icon: Icon
  title: string
  className?: string
  itens?: IDetailsLineProps[]
  loading?: boolean
  useFullWidth?: boolean
}

function UserDetailsCard({
  Icon,
  title,
  className,
  itens,
  loading = false,
  useFullWidth = false
}: IUserDetailsCardProps) {
  if (loading) {
    return (
      <section className={`${styles.card} ${className ?? ''}`}>
        <Skeleton active title={false} paragraph={{ rows: 1 }} />

        {itens?.map((_item, index) => (
          <Skeleton.Button key={index} className={styles.itemSkeleton} active />
        ))}
      </section>
    )
  }

  return (
    <section className={`${styles.card} ${className ?? ''}`}>
      <div className={styles.cardHeader}>
        <Icon size={22} />
        {title}
      </div>

      <div
        className={`${useFullWidth ? styles.twoColumns : styles.itemsContainer}`}
      >
        {itens?.map((item, index) => (
          <DetailsLine
            key={item.key ? String(item.key) : String(index)}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
  )
}

export default UserDetailsCard
