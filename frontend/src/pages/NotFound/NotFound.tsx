import UnauthImage from '@/assets/unauth-image.svg'
import Logo from '@/components/Logo/Logo'
import { ROUTES } from '@/routes/constants'
import { Button, Flex, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import styles from './NotFound.module.scss'

const { Title, Text } = Typography

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className={styles.content}>
      <aside className={styles.form}>
        <Logo />

        <Flex vertical gap={16}>
          <Title level={1} className={styles.code}>
            404
          </Title>

          <Title level={3}>Página não encontrada</Title>

          <Text type='secondary'>
            A página que você tentou acessar não existe ou foi movida.
          </Text>

          <Flex gap={12} className={styles.actions}>
            <Button
              type='primary'
              onClick={() => navigate(ROUTES.DASHBOARD.path)}
            >
              Ir para o Dashboard
            </Button>

            <Button onClick={() => navigate(-1)}>Voltar</Button>
          </Flex>
        </Flex>
      </aside>

      <aside className={styles.image}>
        <img src={UnauthImage} alt='Página não encontrada' />
      </aside>
    </div>
  )
}
