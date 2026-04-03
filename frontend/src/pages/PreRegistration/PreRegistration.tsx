import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import type { IError } from '@/interfaces/IError'
import { Flex, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import type {
  IPreRegistrationErrors,
  PreRegistrationFormValues
} from './IPreRegistration'
import BasicInfo from './components/BasicInfo/BasicInfo'
import PatientInfo from './components/PatientInfo/PatientInfo'
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
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>

      if (error.response?.data?.errors) {
        setFieldErrors(error.response?.data?.errors)
        console.error(error)
        message.error(
          error.response?.data?.message ||
            'Erro nas validações ao finalizar pré-cadastro. '
        )
      }

      console.error(error)
      message.error(
        error.response?.data?.message || 'Erro ao finalizar pré-cadastro. '
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PreRegistrationModal
        values={form.getFieldsValue()}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loading={loading}
      />

      <Flex vertical>
        <AuthLayoutHeader marginBottom={32} />
        <BasicInfo />
        <PatientInfo
          form={form}
          onFinish={onFinish}
          fieldErrors={fieldErrors}
        />
        <SymptomsInfo
          selectedSymptoms={selectedSymptoms}
          setSelectedSymptoms={setSelectedSymptoms}
        />

        <Flex justify='flex-end'>
          <Button onClick={() => setIsOpen(true)}>
            Finalizar pré-cadastro
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default PreRegistration
