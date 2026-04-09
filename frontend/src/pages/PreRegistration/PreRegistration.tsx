import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { handleApiError } from '@/helpers/handleApiError'
import { Flex, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import type {
  IPreRegistrationErrors,
  PreRegistrationFormValues
} from './IPreRegistration'
import AttendanceInfo from './components/AttendanceInfo/AttendanceInfo'
import BasicInfo from './components/BasicInfo/BasicInfo'
import PreRegistrationModal from './components/PreRegistrationModal/PreRegistrationModal'
import SymptomsInfo from './components/SymptomsInfo/SymptomsInfo'

function PreRegistration() {
  const [form] = useForm()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<IPreRegistrationErrors>({})

  async function onFinish(values: PreRegistrationFormValues) {
    try {
      setLoading(true)

      // VIEIRA: Adicionar back
      console.log('Dados do pré-cadastro:', values)

      message.success(`Pré cadastro finalizado com sucesso!`)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao finalizar pré-cadastro. ',
        setFieldErrors
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleFinish() {
    try {
      await form.validateFields()
      setIsOpen(true)
    } catch (error) {
      console.error('Erro ao validar campos:', error)
      message.error(
        'Por favor, corrija os erros nos campos antes de finalizar.'
      )
    }
  }

  return (
    <>
      <PreRegistrationModal
        values={form.getFieldsValue()}
        submitForm={form.submit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loading={loading}
      />

      <Flex vertical>
        <AuthLayoutHeader marginBottom={32} />
        <BasicInfo />
        <AttendanceInfo
          form={form}
          onFinish={onFinish}
          fieldErrors={fieldErrors}
        />
        <SymptomsInfo
          selectedSymptoms={selectedSymptoms}
          setSelectedSymptoms={setSelectedSymptoms}
        />

        <Flex justify='flex-end'>
          <Button onClick={handleFinish}>Finalizar pré-cadastro</Button>
        </Flex>
      </Flex>
    </>
  )
}

export default PreRegistration
