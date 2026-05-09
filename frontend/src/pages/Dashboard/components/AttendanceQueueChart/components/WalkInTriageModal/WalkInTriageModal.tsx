import Button from '@/components/Button/Button'
import {
  FormItem,
  InputDate,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { DayjsType } from '@/components/MultiDatepicker/types'
import formStyles from '@/components/FormComponents/FormComponents.module.scss'
import { handleApiError } from '@/helpers/handleApiError'
import type { IWalkInTriagePayload } from '@/interfaces/IAttendance'
import type { ISymptomOption } from '@/interfaces/ISymptomDiseases'
import { UserGendersLabels, type UserGender } from '@/interfaces/IUser'
import SymptomsInfo from '@/pages/PreRegistration/components/SymptomsInfo/SymptomsInfo'
import parentPreRegStyles from '@/pages/PreRegistration/PreRegistration.module.scss'
import AttendancesFlowRepository from '@/repositories/AttendancesFlowRepository'
import SymptomsDiseasesRepository from '@/repositories/SymptomsDiseasesRepository'
import buildSymptomLabelMap from '@/utils/buildSymptomLabelMap'
import validators, { birthDateValidator } from '@/utils/validators'
import { Form, Input, Modal, Radio, Slider, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import dayjs, { type Dayjs } from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './WalkInTriageModal.module.scss'

const INPUT_HEIGHT = '2.5rem'

export interface WalkInTriageFormValues {
  patientName: string
  patientCpf: string
  patientEmail: string
  patientPassword: string
  mainComplaint: string
  painLevel: number
  selfMedicated: boolean
  symptomStartDate: Dayjs | null
  birthDate?: Dayjs | null
  gender?: UserGender
  conditions?: string
  allergies?: string
  generalObservation?: string
}

interface IWalkInTriageModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

function WalkInTriageModal({ open, onClose, onSuccess }: IWalkInTriageModalProps) {
  const [form] = useForm<WalkInTriageFormValues>()
  const [loading, setLoading] = useState(false)
  const [symptomOptions, setSymptomOptions] = useState<ISymptomOption[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const symptomLabelByKey = useMemo(
    () => buildSymptomLabelMap(symptomOptions),
    [symptomOptions]
  )

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
    } else {
      form.setFieldsValue({
        painLevel: 0,
        selfMedicated: false,
        symptomStartDate: dayjs()
      })
    }
  }, [open, form])

  async function onFinish(values: WalkInTriageFormValues) {
    if (!values.symptomStartDate) {
      message.error('Informe quando os sintomas começaram.')
      return
    }

    const payload: IWalkInTriagePayload = {
      patientName: values.patientName.trim(),
      patientCpf: values.patientCpf,
      patientEmail: values.patientEmail.trim(),
      patientPassword: values.patientPassword,
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

  return (
    <Modal
      title='Atendimento presencial (sem celular)'
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={720}
      destroyOnClose
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
            <InputText mask='cpf' placeholder='CPF' />
          </FormItem>

          <FormItem
            label='E-mail (login do paciente)'
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
            label='Senha do paciente (mín. 6 caracteres; obrigatória se for novo cadastro)'
            name='patientPassword'
            inputHeight={INPUT_HEIGHT}
            rules={[
              { required: true, message: 'Informe a senha do paciente' },
              { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
            ]}
          >
            <Input.Password placeholder='Senha provisória' />
          </FormItem>

          <FormItem
            label='Data de nascimento (opcional)'
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

          <FormItem label='Gênero (opcional)' name='gender' inputHeight={INPUT_HEIGHT}>
            <InputSelect
              inputHeight={INPUT_HEIGHT}
              placeholder='Selecione'
              allowClear
              options={Object.entries(UserGendersLabels).map(([key, value]) => ({
                label: value,
                value: key
              }))}
            />
          </FormItem>

          <h3 className={styles.sectionTitle}>Primeiros dados clínicos</h3>

          <FormItem
            label='Queixa principal'
            name='mainComplaint'
            inputHeight={INPUT_HEIGHT}
            rules={[{ required: true, message: 'Informe a queixa principal' }]}
          >
            <InputText placeholder='Queixa principal' />
          </FormItem>

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

          <FormItem
            label='Se automedicou?'
            name='selfMedicated'
            inputHeight={INPUT_HEIGHT}
            rules={[{ required: true, message: 'Informe se houve automedicação' }]}
          >
            <Radio.Group>
              <Radio value={true}>Sim</Radio>
              <Radio value={false}>Não</Radio>
            </Radio.Group>
          </FormItem>

          <FormItem
            label='Quando os sintomas começaram?'
            name='symptomStartDate'
            inputHeight={INPUT_HEIGHT}
            rules={[
              { required: true, message: 'Informe quando os sintomas começaram' }
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
            label='Condições médicas (opcional)'
            name='conditions'
            inputHeight={INPUT_HEIGHT}
          >
            <InputText placeholder='Condições' />
          </FormItem>

          <FormItem
            label='Alergias (opcional)'
            name='allergies'
            inputHeight={INPUT_HEIGHT}
          >
            <InputText placeholder='Alergias' />
          </FormItem>

          <FormItem
            label='Observação geral (opcional)'
            name='generalObservation'
            inputHeight={INPUT_HEIGHT}
          >
            <InputText placeholder='Observação' />
          </FormItem>

          <div className={`${parentPreRegStyles.formContainer} ${styles.symptomsBlock}`}>
            <h3 className={styles.sectionTitle}>Sintomas (opcional)</h3>
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
              <Button htmlType='submit' loading={loading}>
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
