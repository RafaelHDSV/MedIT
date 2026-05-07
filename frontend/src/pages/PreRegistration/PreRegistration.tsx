import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import { AttendanceStatus, type IAttendance } from '@/interfaces/IAttendance'
import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import AuthRepository from '@/repositories/AuthRepository'
import PatientsRepository from '@/repositories/PatientsRepository'
import SymptomsDiseasesRepository from '@/repositories/SymptomsDiseasesRepository'
import { ROUTES } from '@/routes/constants'
import buildSymptomLabelMap from '@/utils/buildSymptomLabelMap'
import { Flex, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type {
  IPreRegistrationErrors,
  PreRegistrationFormValues
} from './IPreRegistration'
import AttendanceInfo from './components/AttendanceInfo/AttendanceInfo'
import BasicInfo from './components/BasicInfo/BasicInfo'
import PreRegistrationModal from './components/PreRegistrationModal/PreRegistrationModal'
import SymptomsInfo from './components/SymptomsInfo/SymptomsInfo'

function PreRegistration() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form] = useForm()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<IPreRegistrationErrors>({})
  const [symptomOptions, setSymptomOptions] = useState<ISymptomOption[]>([])
  const [unitOptions, setUnitOptions] = useState<
    { label: string; value: string }[]
  >([])
  const [didPrefillEdit, setDidPrefillEdit] = useState(false)

  const editAttendanceId = searchParams.get('attendanceId')
  const isEditMode =
    searchParams.get('mode') === 'edit' && Boolean(editAttendanceId)

  const symptomLabelByKey = useMemo(
    () => buildSymptomLabelMap(symptomOptions),
    [symptomOptions]
  )

  useEffect(() => {
    async function bootstrapPage() {
      try {
        const [symptomResponse, unitsResponse] = await Promise.all([
          SymptomsDiseasesRepository.getSymptomOptions(),
          AuthRepository.getSignupUnits()
        ])

        setSymptomOptions(
          symptomResponse?.data?.symptoms.sort(
            (a: ISymptomOption, b: ISymptomOption) =>
              a.label.localeCompare(b.label)
          ) ?? []
        )

        setUnitOptions(
          (unitsResponse?.data ?? []).map((unit) => ({
            label: unit.name,
            value: unit._id
          }))
        )
      } catch (err) {
        handleApiError({
          err,
          defaultMessage:
            'Não foi possível carregar os dados do pré-atendimento.'
        })
      }
    }

    bootstrapPage()
  }, [])

  useEffect(() => {
    if (!user?.unitId) return
    form.setFieldValue('unitId', String(user.unitId))
  }, [form, user?.unitId])

  useEffect(() => {
    if (
      !isEditMode ||
      !editAttendanceId ||
      !user?._id ||
      didPrefillEdit ||
      !symptomOptions.length
    )
      return

    const editableStatuses = new Set<AttendanceStatus>([
      AttendanceStatus.ON_THE_WAY,
      AttendanceStatus.WAITING_TRIAGE
    ])

    const normalizeStoredSymptoms = (
      raw: string[] | undefined,
      options: ISymptomOption[]
    ): string[] => {
      if (!raw?.length || !options.length) return []
      const keys = new Set<string>()
      for (const entry of raw) {
        const token = typeof entry === 'string' ? entry.trim() : ''
        if (!token) continue
        const byKey = options.find((o) => o.key === token)
        const byLabel = options.find((o) => o.label === token)
        if (byKey) keys.add(byKey.key)
        else if (byLabel) keys.add(byLabel.key)
      }
      return [...keys]
    }

    const loadAttendanceForEdit = async () => {
      try {
        setInitialLoading(true)
        const response = await PatientsRepository.getAttendances({
          patientId: user._id
        })
        const list = response.data as IAttendance[]
        const target = list.find(
          (item) => String(item._id) === String(editAttendanceId)
        )

        if (!target) {
          message.error('Atendimento não encontrado para edição.')
          navigate(ROUTES.DASHBOARD.path)
          return
        }

        if (!editableStatuses.has(target.status)) {
          message.error('Este atendimento não pode mais ser editado.')
          navigate(ROUTES.DASHBOARD.path)
          return
        }

        form.setFieldsValue({
          mainComplaint: target.complaint,
          painLevel: target.painLevel,
          selfMedicated: target.selfMedicated,
          symptomStartDate: target.symptomStartDate
            ? dayjs(target.symptomStartDate)
            : null,
          conditions: target.conditions?.join(', ') || '',
          allergies: target.allergies?.join(', ') || '',
          generalObservation: target.generalObservation || '',
          unitId: target.unitId
            ? String(target.unitId)
            : String(user?.unitId || '')
        })
        setSelectedSymptoms(
          normalizeStoredSymptoms(target.symptoms, symptomOptions)
        )
        setDidPrefillEdit(true)
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Não foi possível carregar o atendimento para edição.'
        })
        navigate(ROUTES.DASHBOARD.path)
      } finally {
        setInitialLoading(false)
      }
    }

    loadAttendanceForEdit()
  }, [
    didPrefillEdit,
    editAttendanceId,
    form,
    isEditMode,
    navigate,
    symptomOptions,
    user?._id,
    user?.unitId
  ])

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

      const body = {
        mainComplaint: values.mainComplaint,
        painLevel: values.painLevel,
        selfMedicated: values.selfMedicated,
        symptomStartDate: values.symptomStartDate,
        symptoms: selectedSymptoms.map((key) => symptomLabelByKey[key] ?? key),
        unitId,
        birthDate: values.birthDate,
        gender: values.gender,
        conditions: values.conditions,
        allergies: values.allergies,
        generalObservation: values.generalObservation
      }

      if (isEditMode && editAttendanceId) {
        await PatientsRepository.updatePatientAttendance({
          attendanceId: editAttendanceId,
          body
        })
      } else {
        await PatientsRepository.createPatientAttendance({ body })
      }

      const normalizedList = (value?: string) =>
        value
          ?.split(',')
          .map((item) => item.trim())
          .filter(Boolean)

      updateUser({
        ...(values.birthDate ? { birthDate: values.birthDate.toDate() } : {}),
        ...(values.gender ? { gender: values.gender } : {}),
        ...(values.conditions !== undefined
          ? { conditions: normalizedList(values.conditions) }
          : {}),
        ...(values.allergies !== undefined
          ? { allergies: normalizedList(values.allergies) }
          : {}),
        ...(unitId ? { unitId } : {})
      })

      setIsOpen(false)
      message.success(
        isEditMode
          ? 'Atendimento atualizado com sucesso!'
          : 'Solicitação de atendimento registrada com sucesso!'
      )
      navigate(ROUTES.DASHBOARD.path)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: isEditMode
          ? 'Não foi possível atualizar seu atendimento.'
          : 'Não foi possível registrar a solicitação. Verifique se você já possui um atendimento em andamento.',
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
        loading={loading || initialLoading}
      />

      <Flex vertical>
        <AuthLayoutHeader marginBottom={32} />
        <BasicInfo />
        <AttendanceInfo
          form={form}
          onFinish={onFinish}
          fieldErrors={fieldErrors}
          unitOptions={unitOptions}
        />
        <SymptomsInfo
          options={symptomOptions}
          selectedSymptoms={selectedSymptoms}
          setSelectedSymptoms={setSelectedSymptoms}
        />

        <Flex justify='flex-end'>
          <Button loading={loading || initialLoading} onClick={handleFinish}>
            {isEditMode ? 'Salvar alterações' : 'Finalizar pré-cadastro'}
          </Button>
        </Flex>
      </Flex>
    </>
  )
}

export default PreRegistration
