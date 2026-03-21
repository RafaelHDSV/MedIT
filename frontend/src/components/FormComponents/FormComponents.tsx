import { Form, type FormItemProps } from 'antd'
import styles from '../../styles/Form.module.scss'

interface IFormItemProps extends FormItemProps {
  children: React.ReactNode
  inputHeight?: string
}

function FormItem({ inputHeight, children, ...props }: IFormItemProps) {
  return (
    <Form.Item
      className={styles.input}
      style={
        {
          '--input-height': inputHeight || '3rem'
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Form.Item>
  )
}

export { FormItem }

