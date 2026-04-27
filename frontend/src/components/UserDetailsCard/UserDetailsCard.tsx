import type { LevelsTypes } from '@/interfaces/IUser'
import Attendances from '@/pages/Attendances/Attendances'
import masks from '@/utils/masks'
import type { Icon } from '@phosphor-icons/react'
import { Modal, Skeleton } from 'antd'
import { useState } from 'react'
import Button from '../Button/Button'
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
  userId?: string
  userType?: LevelsTypes
  isAttendanceHistory?: boolean
}

function UserDetailsCard({
  Icon,
  title,
  className,
  itens,
  loading = false,
  useFullWidth = false,
  userId,
  userType,
  isAttendanceHistory = false
}: IUserDetailsCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const finalItens = isAttendanceHistory ? itens?.slice(0, 4) : itens
  const moreItens = itens && isAttendanceHistory && itens?.length - 4

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  if (loading) {
    return (
      <section className={`${styles.card} ${className ?? ''}`}>
        <Skeleton active title={false} paragraph={{ rows: 1 }} />

        {finalItens?.map((_item, index) => (
          <Skeleton.Button key={index} className={styles.itemSkeleton} active />
        ))}

        {isAttendanceHistory && (
          <Skeleton.Button className={styles.itemSkeleton} active />
        )}
      </section>
    )
  }

  return (
    <>
      <Modal
        open={isModalOpen}
        title={<h3>Histórico dos Atendimentos</h3>}
        onCancel={closeModal}
        footer={null}
        centered
        width={1000}
      >
        <Attendances userId={userId} userType={userType} />
      </Modal>

      <section className={`${styles.card} ${className ?? ''}`}>
        <div className={styles.cardHeader}>
          <Icon size={22} />
          {title}
        </div>

        <div
          className={`${useFullWidth ? styles.twoColumns : styles.itemsContainer}`}
        >
          {finalItens?.map((item, index) => (
            <DetailsLine
              key={item.key ? String(item.key) : String(index)}
              label={item.label}
              value={item.value ? item.value : 'n/a'}
              checked={item.checked ?? false}
            />
          ))}

          {isAttendanceHistory && (
            <Button mode='secondary' onClick={openModal}>
              {`+ ${masks(moreItens, 'number')} atendimentos`}
            </Button>
          )}
        </div>
      </section>
    </>
  )
}

export default UserDetailsCard
