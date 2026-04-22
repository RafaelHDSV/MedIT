import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import PatientsRepository from '@/repositories/PatientsRepository'
import SymptomsDiseasesRepository from '@/repositories/SymptomsDiseasesRepository'
import { ROUTES } from '@/routes/constants'
import buildSymptomLabelMap from '@/utils/buildSymptomLabelMap'
import { Flex, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type {
  IPreRegistrationErrors,
  PreRegistrationFormValues
} from './IPreRegistration'
import AttendanceInfo from './components/AttendanceInfo/AttendanceInfo'
import BasicInfo from './components/BasicInfo/BasicInfo'
import PreRegistrationModal from './components/PreRegistrationModal/PreRegistrationModal'
import SymptomsInfo from './components/SymptomsInfo/SymptomsInfo'

function PreRegistration() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form] = useForm()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<IPreRegistrationErrors>({})
  const [symptomOptions, setSymptomOptions] = useState<ISymptomOption[]>([])

  const symptomLabelByKey = useMemo(
    () => buildSymptomLabelMap(symptomOptions),
    [symptomOptions]
  )

  useEffect(() => {
    async function fetchSymptomOptions() {
      try {
        const response = await SymptomsDiseasesRepository.getSymptomOptions()
        setSymptomOptions(response?.data?.symptoms ?? [])
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Não foi possível carregar a lista de sintomas.'
        })
      }
    }

    fetchSymptomOptions()
  }, [])

  async function onFinish(values: PreRegistrationFormValues) {
    try {
      setLoading(true)
      setFieldErrors({})

      const unitId = values.unitId || user?.unitId
      if (!unitId) {
        setFieldErrors({
          unitId: 'Selecione a unidade de saúde onde deseja ser atendido(a).'
        })
        message.error(
          'Selecione a unidade de saúde onde deseja ser atendido(a).'
        )
        return
      }

      await PatientsRepository.createPatientAttendance({
        body: {
          mainComplaint: values.mainComplaint,
          painLevel: values.painLevel,
          selfMedicated: values.selfMedicated,
          symptomStartDate: values.symptomStartDate,
          symptoms: selectedSymptoms.map(
            (key) => symptomLabelByKey[key] ?? key
          ),
          unitId,
          birthDate: values.birthDate,
          gender: values.gender,
          conditions: values.conditions,
          allergies: values.allergies,
          generalObservation: values.generalObservation
        }
      })

      setIsOpen(false)
      message.success('Solicitação de atendimento registrada com sucesso!')
      navigate(ROUTES.DASHBOARD.path)
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

  useEffect(() => {
    form.setFieldsValue({
      allergies: user?.allergies?.join(', ') || '',
      conditions: user?.conditions?.join(', ') || ''
    })
  }, [form, user?.allergies, user?.conditions])

  return (
    <>
      <PreRegistrationModal
        values={form.getFieldsValue()}
        selectedSymptoms={selectedSymptoms}
        symptomOptions={symptomOptions}
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
          options={symptomOptions}
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
