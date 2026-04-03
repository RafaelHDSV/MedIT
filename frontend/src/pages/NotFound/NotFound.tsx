import Button from '@/components/Button/Button'
import { ROUTES } from '@/routes/constants'
import { Flex, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.scss'

const { Title, Text } = Typography

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Flex vertical gap={16}>
      <Title level={1} className={styles.code}>
        404
      </Title>

      <Title level={3}>Página não encontrada</Title>

      <Text type='secondary'>
        A página que você tentou acessar não existe ou foi movida.
      </Text>

      <Flex gap={12} className={styles.actions}>
        <Button onClick={() => navigate(ROUTES.DASHBOARD.path)}>
          Ir para o Dashboard
        </Button>

        <Button mode='secondary' onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </Flex>
    </Flex>
  )
}
