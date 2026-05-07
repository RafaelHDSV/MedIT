import DetailsLine from '@/components/DetailsLine/DetailsLine'
import { useAuth } from '@/hooks/useAuth'
import { UserGendersLabels } from '@/interfaces/IUser'
import { formatDate } from '@/utils/formatDate'
import masks from '@/utils/masks'
import { Flex } from 'antd'
import parentStyles from '../../PreRegistration.module.scss'
import styles from './BasicInfo.module.scss'

function BasicInfo() {
  const { user } = useAuth()

  return (
    <div className={parentStyles.formContainer}>
      <h3 className={parentStyles.sectionTitle}>Informações básicas</h3>

      <Flex className={styles.container}>
        <DetailsLine label='Nome' value={user?.name} />
        <DetailsLine label='CPF' value={masks(user?.cpf, 'cpf')} />
        <DetailsLine label='Email' value={user?.email} />
        {user?.birthDate && (
          <DetailsLine
            label='Data de nascimento'
            value={formatDate({ date: user?.birthDate, mode: 'date' })}
          />
        )}
        {user?.gender && (
          <DetailsLine label='Gênero' value={UserGendersLabels[user?.gender]} />
        )}
      </Flex>
    </div>
  )
}

export default BasicInfo
