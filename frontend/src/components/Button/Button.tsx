import { Button as AntdButton, type ButtonProps } from 'antd'
import styles from './Button.module.scss'

interface IButtonProps extends ButtonProps {
  mode?: 'primary' | 'secondary' | 'icon'
  children: React.ReactNode
}

function Button({ htmlType, loading, children, mode, ...props }: IButtonProps) {
  const isIcon = mode === 'icon'

  return (
    <AntdButton
      className={mode ? styles[mode] : styles.button}
      type={isIcon ? 'text' : 'primary'}
      loading={loading}
      htmlType={htmlType}
      {...props}
    >
      {children}
    </AntdButton>
  )
}

export default Button
