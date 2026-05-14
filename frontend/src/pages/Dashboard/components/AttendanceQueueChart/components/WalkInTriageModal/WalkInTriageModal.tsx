import Button from '@/components/Button/Button'
import {
    FormItem,
    InputDate,
    InputSelect,
    InputText
} from '@/components/FormComponents/FormComponents'
import formStyles from '@/components/FormComponents/FormComponents.module.scss'
import { DayjsType } from '@/components/MultiDatepicker/types'
import { handleApiError } from '@/helpers/handleApiError'
import type { IWalkInTriagePayload } from '@/interfaces/IAttendance'
import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import { UserGendersLabels } from '@/interfaces/IUser'
import SymptomsInfo from '@/pages/PreRegistration/components/SymptomsInfo/SymptomsInfo'
import AttendancesFlowRepository from '@/repositories/AttendancesFlowRepository'
import PatientsRepository from '@/repositories/PatientsRepository'
import SymptomsDiseasesRepository from '@/repositories/SymptomsDiseasesRepository'
import buildSymptomLabelMap from '@/utils/buildSymptomLabelMap'
import validators, { birthDateValidator } from '@/utils/validators'
import { Form, Input, Modal, Radio, Slider, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './WalkInTriageModal.module.scss'
import type { WalkInTriageFormValues } from './WalkInTriageModalInterfaces'

const INPUT_HEIGHT = '2.5rem'

interface IWalkInTriageModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

function WalkInTriageModal({
  open,
  onClose,
  onSuccess
}: IWalkInTriageModalProps) {
  const [form] = useForm<WalkInTriageFormValues>()
  const [loading, setLoading] = useState(false)
  const [cpfLookupLoading, setCpfLookupLoading] = useState(false)
  const [isExistingPatient, setIsExistingPatient] = useState(false)
  const [symptomOptions, setSymptomOptions] = useState<ISymptomOption[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const symptomLabelByKey = useMemo(
    () => buildSymptomLabelMap(symptomOptions),
    [symptomOptions]
  )

  useEffect(() => {
    if (isExistingPatient) {
      form.setFields([{ name: 'patientPassword', errors: [] }])
    }
  }, [isExistingPatient, form])

  const loadSymptoms = useCallback(async () => {
    try {
      const response = await SymptomsDiseasesRepository.getSymptomOptions()
      setSymptomOptions(
        response?.data?.symptoms.sort((a, b) =>
          a.label.localeCompare(b.label)
        ) ?? []
      )
    } catch {
      message.error('Não foi possível carregar a lista de sintomas.')
    }
  }, [])

  useEffect(() => {
    if (!open) return
    void loadSymptoms()
  }, [open, loadSymptoms])

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setSelectedSymptoms([])
      setIsExistingPatient(false)
    } else {
      form.setFieldsValue({
        painLevel: 0,
        selfMedicated: false,
        symptomStartDate: dayjs()
      })
    }
  }, [open, form])

  const handleCpfLookup = useCallback(async () => {
    const raw = form.getFieldValue('patientCpf')
    const cpfStr = raw != null ? String(raw) : ''
    if (!validators(cpfStr, 'validCpf')) {
      return
    }
    const cleanCpf = cpfStr.replace(/\D/g, '')

    setCpfLookupLoading(true)
    try {
      const res = await PatientsRepository.lookupPatientByCpf({ cpf: cleanCpf })
      const p = res.data

      if (p) {
        setIsExistingPatient(true)
        form.setFieldsValue({
          patientName: p.name,
          patientEmail: p.email,
          patientPassword: '',
          birthDate: p.birthDate ? dayjs(p.birthDate) : undefined,
          gender: p.gender,
          conditions: p.conditions?.length ? p.conditions.join(', ') : '',
          allergies: p.allergies?.length ? p.allergies.join(', ') : ''
        })
        message.success('Paciente encontrado. Dados carregados.')
      } else {
        setIsExistingPatient(false)
        form.setFieldsValue({
          patientName: '',
          patientEmail: '',
          patientPassword: '',
          birthDate: undefined,
          gender: undefined,
          conditions: '',
          allergies: ''
        })
        message.info(
          'Nenhum cadastro com este CPF. Preencha os dados para criar a conta do paciente.'
        )
      }
    } catch {
      message.error('Não foi possível consultar o CPF.')
    } finally {
      setCpfLookupLoading(false)
    }
  }, [form])

  async function onFinish(values: WalkInTriageFormValues) {
    if (!values.symptomStartDate) {
      message.error('Informe quando os sintomas começaram.')
      return
    }

    const payload: IWalkInTriagePayload = {
      patientName: values.patientName.trim(),
      patientCpf: values.patientCpf,
      patientEmail: values.patientEmail.trim(),
      patientPassword: values.patientPassword ?? '',
      mainComplaint: values.mainComplaint.trim(),
      painLevel: values.painLevel,
      selfMedicated: values.selfMedicated,
      symptomStartDate: values.symptomStartDate.toISOString(),
      symptoms: selectedSymptoms.map((k) => symptomLabelByKey[k] ?? k),
      conditions: values.conditions,
      allergies: values.allergies,
      generalObservation: values.generalObservation,
      ...(values.birthDate
        ? { birthDate: values.birthDate.toISOString() }
        : {}),
      ...(values.gender ? { gender: values.gender } : {})
    }

    try {
      setLoading(true)
      await AttendancesFlowRepository.createWalkInTriage(payload)
      message.success('Atendimento presencial registrado na fila de triagem.')
      onSuccess()
      onClose()
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Não foi possível registrar o atendimento presencial.'
      })
    } finally {
      setLoading(false)
    }
  }

  const passwordRules = isExistingPatient
    ? []
    : [
        { required: true, message: 'Informe a senha do paciente' },
        { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
      ]

  return (
    <Modal
      title='Atendimento presencial'
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={920}
      destroyOnHidden
    >
      <div className={styles.container}>
        <Form
          form={form}
          className={formStyles.form}
          layout='vertical'
          onFinish={(v) => void onFinish(v)}
          initialValues={{ painLevel: 0, selfMedicated: false }}
        >
          <h3 className={styles.sectionTitle}>Identificação do paciente</h3>
          <p className={styles.hint}>
            Informe o CPF e saia do campo para buscar cadastro existente.
          </p>

          <div className={styles.formGrid}>
            <div className={styles.span2}>
              <FormItem
                label='CPF'
                name='patientCpf'
                inputHeight={INPUT_HEIGHT}
                rules={[
                  { required: true, message: 'Informe o CPF' },
                  {
                    validator(_, value) {
                      if (!value) return Promise.resolve()
                      const ok = validators(String(value), 'validCpf')
                      return ok
                        ? Promise.resolve()
                        : Promise.reject(new Error('CPF inválido'))
                    }
                  }
                ]}
              >
                <InputText
                  mask='cpf'
                  placeholder='CPF'
                  disabled={cpfLookupLoading}
                  onBlur={() => void handleCpfLookup()}
                />
              </FormItem>
            </div>

            <FormItem
              label='Nome completo'
              name='patientName'
              inputHeight={INPUT_HEIGHT}
              rules={[
                { required: true, message: 'Informe o nome completo' },
                {
                  validator: (_, value) => {
                    const v = typeof value === 'string' ? value.trim() : ''
                    if (!v) return Promise.resolve()
                    if (v.length < 3 || v.split(' ').length < 2) {
                      return Promise.reject(
                        new Error(
                          'Nome deve ter ao menos 3 caracteres e sobrenome'
                        )
                      )
                    }
                    return Promise.resolve()
                  }
                }
              ]}
            >
              <Input placeholder='Nome e sobrenome' />
            </FormItem>

            <FormItem
              label='E-mail'
              name='patientEmail'
              inputHeight={INPUT_HEIGHT}
              rules={[
                { required: true, message: 'Informe o e-mail' },
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve()
                    const ok = validators(String(value), 'email')
                    return ok
                      ? Promise.resolve()
                      : Promise.reject(new Error('E-mail inválido'))
                  }
                }
              ]}
            >
              <Input placeholder='email@exemplo.com' />
            </FormItem>

            <FormItem
              label='Senha do paciente'
              name='patientPassword'
              inputHeight={INPUT_HEIGHT}
              extra={
                isExistingPatient
                  ? 'Conta já cadastrada: envie o formulário sem alterar a senha.'
                  : 'Mínimo 6 caracteres para novo cadastro.'
              }
              rules={passwordRules}
            >
              <Input.Password
                placeholder={
                  isExistingPatient
                    ? 'Opcional para quem já tem conta'
                    : 'Senha para acesso do paciente'
                }
              />
            </FormItem>

            <FormItem
              label='Data de nascimento'
              name='birthDate'
              inputHeight={INPUT_HEIGHT}
              rules={[
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve()
                    return birthDateValidator(value)
                  }
                }
              ]}
            >
              <InputDate
                value={form.getFieldValue('birthDate')}
                inputHeight={INPUT_HEIGHT}
                dateType={DayjsType.date}
                onChange={(date) => form.setFieldsValue({ birthDate: date })}
              />
            </FormItem>

            <div className={styles.span2}>
              <FormItem label='Gênero' name='gender' inputHeight={INPUT_HEIGHT}>
                <InputSelect
                  inputHeight={INPUT_HEIGHT}
                  placeholder='Selecione'
                  allowClear
                  options={Object.entries(UserGendersLabels).map(
                    ([key, value]) => ({
                      label: value,
                      value: key
                    })
                  )}
                />
              </FormItem>
            </div>
          </div>

          <h3 className={styles.sectionTitle}>Primeiros dados clínicos</h3>

          <div className={styles.formGrid}>
            <div className={styles.span2}>
              <FormItem
                label='Queixa principal'
                name='mainComplaint'
                inputHeight={INPUT_HEIGHT}
                rules={[
                  { required: true, message: 'Informe a queixa principal' }
                ]}
              >
                <InputText placeholder='Queixa principal' />
              </FormItem>
            </div>

            <div className={styles.span2}>
              <FormItem
                label='Nível de dor'
                name='painLevel'
                inputHeight={INPUT_HEIGHT}
                rules={[
                  { required: true, message: 'Informe o nível de dor' },
                  {
                    validator: (_, value) => {
                      if (value === undefined || value === null) {
                        return Promise.resolve()
                      }
                      const n = Number(value)
                      if (!Number.isFinite(n) || n < 0 || n > 10) {
                        return Promise.reject(
                          new Error('Nível de dor entre 0 e 10.')
                        )
                      }
                      return Promise.resolve()
                    }
                  }
                ]}
              >
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  tooltip={{ formatter: (v) => (v != null ? String(v) : '') }}
                />
              </FormItem>
            </div>

            <FormItem
              label='Se automedicou?'
              name='selfMedicated'
              inputHeight={INPUT_HEIGHT}
              rules={[
                { required: true, message: 'Informe se houve automedicação' }
              ]}
            >
              <Radio.Group>
                <Radio value={true}>Sim</Radio>
                <Radio value={false}>Não</Radio>
              </Radio.Group>
            </FormItem>

            <FormItem
              label='Início dos sintomas'
              name='symptomStartDate'
              inputHeight={INPUT_HEIGHT}
              rules={[
                {
                  required: true,
                  message: 'Informe quando os sintomas começaram'
                }
              ]}
            >
              <InputDate
                value={form.getFieldValue('symptomStartDate')}
                inputHeight={INPUT_HEIGHT}
                dateType={DayjsType.date}
                onChange={(date) =>
                  form.setFieldsValue({ symptomStartDate: date })
                }
              />
            </FormItem>

            <FormItem
              label='Condições médicas'
              name='conditions'
              inputHeight={INPUT_HEIGHT}
            >
              <InputText placeholder='Condições' />
            </FormItem>

            <FormItem
              label='Alergias'
              name='allergies'
              inputHeight={INPUT_HEIGHT}
            >
              <InputText placeholder='Alergias' />
            </FormItem>

            <div className={styles.span2}>
              <FormItem
                label='Observação geral'
                name='generalObservation'
                inputHeight={INPUT_HEIGHT}
              >
                <InputText placeholder='Observação' />
              </FormItem>
            </div>
          </div>

          <div className={styles.symptomsBlock}>
            <SymptomsInfo
              options={symptomOptions}
              selectedSymptoms={selectedSymptoms}
              setSelectedSymptoms={setSelectedSymptoms}
            />
          </div>

          <FormItem style={{ marginTop: 16, marginBottom: 0 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.5rem'
              }}
            >
              <Button mode='outline' htmlType='button' onClick={onClose}>
                Cancelar
              </Button>
              <Button htmlType='submit' loading={loading || cpfLookupLoading}>
                Registrar na fila
              </Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </Modal>
  )
}

export default WalkInTriageModal
