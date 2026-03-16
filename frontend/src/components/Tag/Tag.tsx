import styles from './Tag.module.scss'

export const TagStatuses = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
} as const
export type TagStatuses = (typeof TagStatuses)[keyof typeof TagStatuses]

interface ITagProps {
  status: TagStatuses
  children: React.ReactNode
}

function Tag({ status, children }: ITagProps) {
  return <span className={`${styles.tag} ${styles[status]}`}>{children}</span>
}

export default Tag
