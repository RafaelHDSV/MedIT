import Button from '@/components/Button/Button'
import DetailsLine from '@/components/DetailsLine/DetailsLine'
import masks from '@/utils/masks'
import { Flex, Modal } from 'antd'
import dayjs from 'dayjs'
import type { PreRegistrationFormValues } from '../../IPreRegistration'
import styles from './PreRegistrationModal.module.scss'

interface IPreRegistrationModalProps {
  values: PreRegistrationFormValues
  selectedSymptoms: string[]
  submitForm: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  loading: boolean
}

function PreRegistrationModal({
  values,
  selectedSymptoms,
  submitForm,
  isOpen,
  setIsOpen,
  loading
}: IPreRegistrationModalProps) {
  const {
    mainComplaint,
    symptomStartDate,
    selfMedicated,
    painLevel,
    conditions,
    allergies,
    generalObservation
  } = values

  function handleConfirm() {
    submitForm()
  }

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

        <div className={styles.itemsContainer}>
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
          <DetailsLine
            label='Sintomas selecionados'
            value={
              selectedSymptoms.length
                ? selectedSymptoms.join(', ')
                : 'Nenhum selecionado'
            }
          />
          {conditions?.trim() && (
            <DetailsLine label='Condições médicas' value={conditions} />
          )}
          {allergies?.trim() && (
            <DetailsLine label='Alergias' value={allergies} />
          )}
          {generalObservation?.trim() && (
            <DetailsLine label='Observação geral' value={generalObservation} />
          )}
        </div>

        <Flex justify='flex-end'>
          <Button onClick={handleConfirm} loading={loading}>
            Confirmar consulta
          </Button>
        </Flex>
      </section>
    </Modal>
  )
}

export default PreRegistrationModal
