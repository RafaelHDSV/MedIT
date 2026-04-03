import Button from '@/components/Button/Button'
import DetailsLine from '@/components/DetailsLine/DetailsLine'
import masks from '@/utils/masks'
import { Flex, Modal } from 'antd'
import dayjs from 'dayjs'
import type { PreRegistrationFormValues } from '../../IPreRegistration'
import styles from './PreRegistrationModal.module.scss'

interface IPreRegistrationModalProps {
  values: PreRegistrationFormValues
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  loading: boolean
}

function PreRegistrationModal({
  values,
  isOpen,
  setIsOpen,
  loading
}: IPreRegistrationModalProps) {
  const { mainComplaint, symptomStartDate, selfMedicated, painLevel } = values

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      centered
      width={450}
    >
      <section className={styles.container}>
        <h2 className={styles.title}>Confirmação de consulta</h2>

        <div>
          <DetailsLine label='Queixa principal' value={mainComplaint} />
          <DetailsLine
            label='Os sintomas começaram'
            value={dayjs(symptomStartDate).format('DD/MM/YYYY')}
          />
          <DetailsLine
            label='Se automedicou?'
            value={masks(String(selfMedicated), 'boolean')}
          />
          <DetailsLine label='Nível de dor' value={painLevel} />
        </div>

        <Flex justify='flex-end'>
          <Button onClick={() => setIsOpen(false)} loading={loading}>
            Confirmar consulta
          </Button>
        </Flex>
      </section>
    </Modal>
  )
}

export default PreRegistrationModal
