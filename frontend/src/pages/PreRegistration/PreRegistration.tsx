import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import {
  FormItem,
  InputDate,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { DayjsType } from '@/components/MultiDatepicker/types'
import { useAuth } from '@/hooks/useAuth'
import type { IError } from '@/interfaces/IError'
import { UserGendersLabels } from '@/interfaces/IUser'
import { birthDateValidator } from '@/utils/validators'
import { Flex, Form, message, Modal, Radio, Slider, Tag, Tooltip } from 'antd'
import { useForm, type FormInstance } from 'antd/es/form/Form'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'
import formStyles from '../../components/FormComponents/FormComponents.module.scss'
import type {
  IPreRegistrationErrors,
  PreRegistrationFormValues
} from './IPreRegistration'
import styles from './PreRegistration.module.scss'

const inputHeight = '2.5rem'

// VIEIRA: Refatorar o modal completo
function PreRegistrationModal({
  isOpen,
  setIsOpen,
  loading
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  loading: boolean
}) {
  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      centered
      width={450}
    >
      <Flex vertical gap={30}>
        <h2 style={{ textAlign: 'center', margin: 0 }}>
          Confirmação de consulta
        </h2>
        <Flex
          justify='space-between'
          style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}
        >
          <span>
            <b>Queixa principal</b>
          </span>
          <span style={{ color: '#888' }}>Náusea</span>
        </Flex>
        <Flex
          justify='space-between'
          style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}
        >
          <span>
            <b>Os sintomas começaram</b>
          </span>
          <span style={{ color: '#888' }}>08/03/2026</span>
        </Flex>
        <Flex
          justify='space-between'
          style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}
        >
          <span>
            <b>Se automedicou?</b>
          </span>
          <span style={{ color: '#888' }}>Não</span>
        </Flex>
        <Flex
          justify='space-between'
          style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}
        >
          <span>
            <b>Nível de dor</b>
          </span>
          <span style={{ color: '#888' }}>8</span>
        </Flex>
        <Flex justify='flex-end'>
          <Button
            type='primary'
            size='large'
            style={{
              backgroundColor: '#e05c3a',
              borderColor: '#e05c3a',
              borderRadius: 8
            }}
            onClick={() => setIsOpen(false)}
            loading={loading}
          >
            Confirmar consulta
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

function BasicInfo() {
  const { user } = useAuth()

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.sectionTitle}>Informações básicas</h3>

      <Flex className={styles.container}>
        <Flex className={styles.item}>
          <b className={styles.label}>Nome</b>
          <Tooltip title={user?.name}>
            <span className={styles.value}>{user?.name}</span>
          </Tooltip>
        </Flex>

        <Flex className={styles.item}>
          <b className={styles.label}>CPF</b>
          <Tooltip title={user?.cpf}>
            <span className={styles.value}>{user?.cpf}</span>
          </Tooltip>
        </Flex>

        <Flex className={styles.item}>
          <b className={styles.label}>Email</b>
          <Tooltip title={user?.email}>
            <span className={styles.value}>{user?.email}</span>
          </Tooltip>
        </Flex>

        <Flex className={styles.item}>
          <b className={styles.label}>Data e Hora</b>
          <Tooltip title={dayjs().format('DD/MM/YYYY HH:mm')}>
            <span className={styles.value}>
              {dayjs().format('DD/MM/YYYY HH:mm')}
            </span>
          </Tooltip>
        </Flex>
      </Flex>
    </div>
  )
}

function PatientInfo({
  form,
  onFinish,
  fieldErrors
}: {
  form: FormInstance<PreRegistrationFormValues>
  onFinish: (values: PreRegistrationFormValues) => void
  fieldErrors: IPreRegistrationErrors
}) {
  return (
    <div className={styles.formContainer}>
      <h3 className={styles.sectionTitle}>Informações do Paciente</h3>

      <Form
        form={form}
        className={`${styles.inputsContainer} ${formStyles.form}`}
        layout='vertical'
        onFinish={onFinish}
      >
        <FormItem
          label='Data de nascimento'
          name='birthDate'
          inputHeight={inputHeight}
          rules={[
            { required: true, message: 'Informe sua data de nascimento' },
            {
              validator(_, value) {
                return birthDateValidator(value)
              }
            }
          ]}
          validateStatus={fieldErrors.birthDate ? 'error' : undefined}
          help={fieldErrors.birthDate}
        >
          <InputDate
            value={form.getFieldValue('birthDate')}
            inputHeight={inputHeight}
            dateType={DayjsType.date}
            onChange={(date) => form.setFieldsValue({ birthDate: date })}
          />
        </FormItem>

        <FormItem
          label='Gênero'
          name='gender'
          inputHeight={inputHeight}
          rules={[{ required: true, message: 'Informe seu gênero' }]}
          validateStatus={fieldErrors.gender ? 'error' : undefined}
          help={fieldErrors.gender}
        >
          <InputSelect
            inputHeight={inputHeight}
            placeholder='Selecione seu gênero'
            options={Object.entries(UserGendersLabels).map(([key, value]) => ({
              label: value,
              value: key
            }))}
          />
        </FormItem>

        <FormItem
          label='Nível de dor'
          name='painLevel'
          inputHeight={inputHeight}
          rules={[{ required: true, message: 'Informe seu nível de dor' }]}
          validateStatus={fieldErrors.painLevel ? 'error' : undefined}
          help={fieldErrors.painLevel}
        >
          <Slider min={0} max={10} dots />
        </FormItem>

        <FormItem
          label='Queixa principal'
          name='mainComplaint'
          inputHeight={inputHeight}
          rules={[{ required: true, message: 'Informe sua queixa principal' }]}
          validateStatus={fieldErrors.mainComplaint ? 'error' : undefined}
          help={fieldErrors.mainComplaint}
        >
          <InputText placeholder='Digite sua queixa principal' />
        </FormItem>

        <FormItem
          label='Se automedicou?'
          name='selfMedicated'
          inputHeight={inputHeight}
          rules={[
            { required: true, message: 'Informe se você se automedicou' }
          ]}
          validateStatus={fieldErrors.selfMedicated ? 'error' : undefined}
          help={fieldErrors.selfMedicated}
        >
          <Radio.Group>
            <Radio value={true}>Sim</Radio>
            <Radio value={false}>Não</Radio>
          </Radio.Group>
        </FormItem>

        <FormItem
          label='Quando os sintomas começaram?'
          name='symptomStartDate'
          inputHeight={inputHeight}
          rules={[
            {
              required: true,
              message: 'Informe quando os sintomas começaram'
            }
          ]}
          validateStatus={fieldErrors.symptomStartDate ? 'error' : undefined}
          help={fieldErrors.symptomStartDate}
        >
          <InputDate
            value={form.getFieldValue('symptomStartDate')}
            inputHeight={inputHeight}
            dateType={DayjsType.date}
            onChange={(date) => form.setFieldsValue({ symptomStartDate: date })}
          />
        </FormItem>

        <FormItem
          label='Condições médicas'
          name='conditions'
          inputHeight={inputHeight}
          validateStatus={fieldErrors.conditions ? 'error' : undefined}
          help={fieldErrors.conditions}
        >
          <InputText placeholder='Digite suas condições médicas' />
        </FormItem>

        <FormItem
          label='Alergias'
          name='allergies'
          inputHeight={inputHeight}
          validateStatus={fieldErrors.allergies ? 'error' : undefined}
          help={fieldErrors.allergies}
        >
          <InputText placeholder='Digite suas alergias' />
        </FormItem>

        <FormItem
          label='Observação geral'
          name='generalObservation'
          inputHeight={inputHeight}
          validateStatus={fieldErrors.generalObservation ? 'error' : undefined}
          help={fieldErrors.generalObservation}
        >
          <InputText placeholder='Digite sua observação geral' />
        </FormItem>
      </Form>
    </div>
  )
}

function SymptomSection({
  selectedSymptoms,
  setSelectedSymptoms
}: {
  selectedSymptoms: string[]
  setSelectedSymptoms: React.Dispatch<React.SetStateAction<string[]>>
}) {
  // VIEIRA: Adicionar dinâmico
  const symptoms = [
    'Febre',
    'Dor de cabeça',
    'Dor no corpo',
    'Tosse',
    'Náusea',
    'Fadiga',
    'Dor de garganta',
    'Calafrios',
    'Falta de ar',
    'Dor abdominal',
    'Diarreia',
    'Vômito',
    'Confusão mental',
    'Perda de olfato/paladar',
    'Erupção cutânea',
    'Inchaço',
    'Dificuldade para dormir',
    'Ansiedade',
    'Depressão'
  ]

  const handleSelectSymptoms = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.sectionTitle}>Sintomas</h3>

      <Flex wrap='wrap' gap={8}>
        {symptoms.map((symptom) => (
          <Tag
            key={symptom}
            onClick={() => handleSelectSymptoms(symptom)}
            className={`${styles.symptomTag} ${selectedSymptoms.includes(symptom) ? styles.selected : ''}`}
          >
            {symptom}
          </Tag>
        ))}
      </Flex>
    </div>
  )
}

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
        <SymptomSection
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
