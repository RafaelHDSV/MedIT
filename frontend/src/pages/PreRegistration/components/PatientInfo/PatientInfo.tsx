import {
  FormItem,
  InputDate,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { DayjsType } from '@/components/MultiDatepicker/types'
import { UserGendersLabels } from '@/interfaces/IUser'
import { birthDateValidator } from '@/utils/validators'
import { Form, Radio, Slider, type FormInstance } from 'antd'
import formStyles from '../../../../components/FormComponents/FormComponents.module.scss'
import type {
  IPreRegistrationErrors,
  PreRegistrationFormValues
} from '../../IPreRegistration'
import parentStyles from '../../PreRegistration.module.scss'
import styles from './PatientInfo.module.scss'

const INPUT_HEIGHT = '2.5rem'

interface IPatientInfoProps {
  form: FormInstance<PreRegistrationFormValues>
  onFinish: (values: PreRegistrationFormValues) => void
  fieldErrors: IPreRegistrationErrors
}

function PatientInfo({ form, onFinish, fieldErrors }: IPatientInfoProps) {
  return (
    <div className={parentStyles.formContainer}>
      <h3 className={parentStyles.sectionTitle}>Informações do Paciente</h3>

      <Form
        form={form}
        className={`${styles.inputsContainer} ${formStyles.form}`}
        layout='vertical'
        onFinish={onFinish}
      >
        <FormItem
          label='Data de nascimento'
          name='birthDate'
          inputHeight={INPUT_HEIGHT}
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
            inputHeight={INPUT_HEIGHT}
            dateType={DayjsType.date}
            onChange={(date) => form.setFieldsValue({ birthDate: date })}
          />
        </FormItem>

        <FormItem
          label='Gênero'
          name='gender'
          inputHeight={INPUT_HEIGHT}
          rules={[{ required: true, message: 'Informe seu gênero' }]}
          validateStatus={fieldErrors.gender ? 'error' : undefined}
          help={fieldErrors.gender}
        >
          <InputSelect
            inputHeight={INPUT_HEIGHT}
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
          inputHeight={INPUT_HEIGHT}
          rules={[{ required: true, message: 'Informe seu nível de dor' }]}
          validateStatus={fieldErrors.painLevel ? 'error' : undefined}
          help={fieldErrors.painLevel}
        >
          <Slider min={0} max={10} dots />
        </FormItem>

        <FormItem
          label='Queixa principal'
          name='mainComplaint'
          inputHeight={INPUT_HEIGHT}
          rules={[{ required: true, message: 'Informe sua queixa principal' }]}
          validateStatus={fieldErrors.mainComplaint ? 'error' : undefined}
          help={fieldErrors.mainComplaint}
        >
          <InputText placeholder='Digite sua queixa principal' />
        </FormItem>

        <FormItem
          label='Se automedicou?'
          name='selfMedicated'
          inputHeight={INPUT_HEIGHT}
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
          inputHeight={INPUT_HEIGHT}
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
            inputHeight={INPUT_HEIGHT}
            dateType={DayjsType.date}
            onChange={(date) => form.setFieldsValue({ symptomStartDate: date })}
          />
        </FormItem>

        <FormItem
          label='Condições médicas'
          name='conditions'
          inputHeight={INPUT_HEIGHT}
          validateStatus={fieldErrors.conditions ? 'error' : undefined}
          help={fieldErrors.conditions}
        >
          <InputText placeholder='Digite suas condições médicas' />
        </FormItem>

        <FormItem
          label='Alergias'
          name='allergies'
          inputHeight={INPUT_HEIGHT}
          validateStatus={fieldErrors.allergies ? 'error' : undefined}
          help={fieldErrors.allergies}
        >
          <InputText placeholder='Digite suas alergias' />
        </FormItem>

        <FormItem
          label='Observação geral'
          name='generalObservation'
          inputHeight={INPUT_HEIGHT}
          validateStatus={fieldErrors.generalObservation ? 'error' : undefined}
          help={fieldErrors.generalObservation}
        >
          <InputText placeholder='Digite sua observação geral' />
        </FormItem>
      </Form>
    </div>
  )
}

export default PatientInfo
