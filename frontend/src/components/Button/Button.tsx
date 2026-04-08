import { Button as AntdButton, type ButtonProps } from 'antd'
import { useMemo } from 'react'
import styles from './Button.module.scss'

interface IButtonProps extends ButtonProps {
  mode?: 'primary' | 'secondary' | 'outline' | 'icon'
  buttonHeight?: string
}

function Button({
  mode,
  buttonHeight = '2.5rem',
  htmlType,
  loading,
  children,
  className,
  ...props
}: IButtonProps) {
  const isIcon = mode === 'icon'

  const type = useMemo(() => {
    switch (mode) {
      case 'primary':
        return 'primary'
      case 'secondary':
        return 'text'
      case 'outline':
        return 'default'
      case 'icon':
        return 'default'
      default:
        return 'primary'
    }
  }, [mode])

  return (
    <AntdButton
      className={`${styles.button} ${mode ? styles[mode] : ''} ${className ?? ''}`}
      style={
        {
          '--button-height': buttonHeight
        } as React.CSSProperties
      }
      type={type}
      loading={loading}
      htmlType={htmlType}
      icon={isIcon ? children : undefined}
      {...props}
    >
      {!isIcon && children}
    </AntdButton>
  )
}

export default Button
