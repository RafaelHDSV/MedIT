import { useTheme } from '@/hooks/useTheme'
import { MoonIcon, SunIcon } from '@phosphor-icons/react'
import { Tooltip } from 'antd'
import styles from './ThemeToggle.module.scss'

interface IThemeToggleProps {
  isCompact?: boolean
  iconOnly?: boolean
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

function ThemeToggle({
  isCompact = false,
  iconOnly = false,
  placement = 'right'
}: IThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const label = isDark ? 'Tema claro' : 'Tema escuro'
  const showLabel = !isCompact && !iconOnly

  return (
    <Tooltip title={isCompact || iconOnly ? label : ''} placement={placement}>
      <button
        type='button'
        className={`${styles.toggle} ${isCompact ? styles.compact : ''} ${iconOnly ? styles.iconOnly : ''}`}
        onClick={toggleTheme}
        aria-pressed={isDark}
        aria-label={label}
      >
        {isDark ? <SunIcon size={22} /> : <MoonIcon size={22} />}
        {showLabel ? <span>{label}</span> : null}
      </button>
    </Tooltip>
  )
}

export default ThemeToggle
