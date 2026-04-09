import type { IconProps } from '@phosphor-icons/react'
import { Tooltip } from 'antd'
import type { FC } from 'react'
import styles from './TooltipColumn.module.scss'

interface ITooltipColumnProps {
  text?: string
  icon?: FC<IconProps>
  className?: string
}

function TooltipColumn({ text, icon: Icon, className }: ITooltipColumnProps) {
  const display = text ? text : 'n/a'

  const spanContent = () => {
    if (Icon) {
      return (
        <div className={styles.iconContainer}>
          <Icon size={16} />
        </div>
      )
    }

    return <span className={`ellipsis w-100 ${className}`}>{display}</span>
  }

  return (
    <div className='ellipsis'>
      <Tooltip title={display}>{spanContent()}</Tooltip>
    </div>
  )
}

export default TooltipColumn
