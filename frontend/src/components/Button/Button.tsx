import { Button as AntdButton, type ButtonProps } from 'antd'
import styles from './Button.module.scss'

function Button({ htmlType, loading, children, ...props }: ButtonProps) {
  return (
    <AntdButton
      className={styles.button}
      type='primary'
      loading={loading}
      htmlType={htmlType}
      {...props}
    >
      {children}
    </AntdButton>
  )
}

export default Button
