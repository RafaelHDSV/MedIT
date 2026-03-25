import { Button as AntdButton, type ButtonProps } from 'antd'
import { useMemo } from 'react'
import styles from './Button.module.scss'

interface IButtonProps extends ButtonProps {
  mode?: 'primary' | 'secondary' | 'icon'
  children: React.ReactNode
}

function Button({ htmlType, loading, children, mode, ...props }: IButtonProps) {
  const isIcon = mode === 'icon'

  const type = useMemo(() => {
    switch (mode) {
      case 'primary':
        return 'primary'
      case 'secondary':
        return 'default'
      case 'icon':
        return 'default'
      default:
        return 'primary'
    }
  }, [mode])

  return (
    <AntdButton
      className={mode ? styles[mode] : styles.button}
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
