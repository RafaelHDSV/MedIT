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
  fontSize?: number
  children: React.ReactNode
}

function Tag({ status, fontSize = 14, children }: ITagProps) {
  return (
    <span
      className={`${styles.tag} ${styles[status]}`}
      style={
        {
          '--tag-font-size': `${fontSize}px`
        } as React.CSSProperties
      }
    >
      {children}
    </span>
  )
}

export default Tag
