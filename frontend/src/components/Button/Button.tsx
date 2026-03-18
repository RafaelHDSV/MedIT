import { Button as AntdButton, type ButtonProps } from 'antd'
import styles from './Button.module.scss'

function Button({ htmlType, loading, children }: ButtonProps) {
  return (
    <AntdButton
      className={styles.button}
      type='primary'
      loading={loading}
      htmlType={htmlType}
    >
      {children}
    </AntdButton>
  )
}

export default Button
