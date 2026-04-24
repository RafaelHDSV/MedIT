import Button from '@/components/Button/Button'
import {
  FormItem,
  InputSelect,
  InputText
} from '@/components/FormComponents/FormComponents'
import { handleApiError } from '@/helpers/handleApiError'
import {
  MedicationCategoriesLabels,
  type IMedicationFormErrors,
  type MedicationFormValues
} from '@/interfaces/IMedication'
import MedicationsRepository from '@/repositories/MedicationsRepository'
import { Form, InputNumber, message, Modal, Radio } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import formStyles from '../../../../components/FormComponents/FormComponents.module.scss'
import styles from './MedicationModal.module.scss'

interface IMedicationModalProps {
  isModalOpen: boolean
  setIsModalOpen: (bool: boolean) => void
  fetchMedications: () => void
}

function MedicationModal({
  isModalOpen,
  setIsModalOpen,
  fetchMedications
}: IMedicationModalProps) {
  const { unitId } = useParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<IMedicationFormErrors>({})

  const inputHeight = '2.5rem'

  async function onFinish(values: MedicationFormValues) {
    setLoading(true)
    // VIEIRA: Fazer edit

    try {
      await MedicationsRepository.createMedication({
        body: {
          ...values,
          unitId: String(unitId),
          requiresPrescription: values.requiresPrescription ? true : false
        }
      })
      message.success('Medicamento cadastrado com sucesso!')
      handleCancelModal()
      fetchMedications()
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao cadastrar medicamento',
        setFieldErrors
      })
    } finally {
      setLoading(false)
    }
  }

  function handleCancelModal() {
    setIsModalOpen(false)
    form.resetFields()
    setFieldErrors({})
  }

  return (
    <Modal
      className={styles.modal}
      open={isModalOpen}
      onCancel={handleCancelModal}
      footer={null}
      centered
    >
      <h2>Cadastrar medicamento</h2>

      <Form
        form={form}
        className={`${formStyles.form} mt-1`}
        layout='vertical'
        onFinish={onFinish}
      >
        <div className={styles.formInputs}>
          <FormItem
            name='name'
            label='Nome do Medicamento'
            inputHeight={inputHeight}
            rules={[
              { required: true, message: 'Nome do medicamento é obrigatório' }
            ]}
            validateStatus={fieldErrors.name ? 'error' : undefined}
            help={fieldErrors.name}
          >
            <InputText placeholder='Digite o nome do medicamento' />
          </FormItem>

          <FormItem
            name='category'
            label='Categoria'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Categoria é obrigatória' }]}
            validateStatus={fieldErrors.category ? 'error' : undefined}
            help={fieldErrors.category}
          >
            <InputSelect
              inputHeight={inputHeight}
              placeholder='Selecione a categoria'
              options={Object.entries(MedicationCategoriesLabels).map(
                ([key, value]) => ({
                  label: value,
                  value: key
                })
              )}
            />
          </FormItem>

          <FormItem
            name='description'
            label='Descrição'
            inputHeight={inputHeight}
            rules={[{ required: true, message: 'Descrição é obrigatória' }]}
            validateStatus={fieldErrors.description ? 'error' : undefined}
            help={fieldErrors.description}
          >
            <InputText placeholder='Descrição do medicamento' />
          </FormItem>

          <FormItem
            name='stockQuantity'
            label='Quantidade em Estoque'
            inputHeight={inputHeight}
            rules={[
              {
                required: true,
                message: 'A quantidade em estoque é obrigatória'
              },
              {
                validator(_, value) {
                  if (value < 0) {
                    return Promise.reject(
                      new Error('A quantidade em estoque não pode ser negativa')
                    )
                  }
                  return Promise.resolve()
                }
              }
            ]}
            validateStatus={fieldErrors.stockQuantity ? 'error' : undefined}
            help={fieldErrors.stockQuantity}
          >
            <InputNumber className='w-100' min={0} />
          </FormItem>

          <FormItem
            name='requiresPrescription'
            label='Necessita de Receita Médica?'
            inputHeight={inputHeight}
            validateStatus={
              fieldErrors.requiresPrescription ? 'error' : undefined
            }
            help={fieldErrors.requiresPrescription}
          >
            <Radio.Group
              defaultValue={false}
              options={[
                { label: 'Sim', value: true },
                { label: 'Não', value: false }
              ]}
            />
          </FormItem>
        </div>

        <footer className={styles.footer}>
          <FormItem>
            <Button htmlType='submit' loading={loading}>
              Cadastrar
            </Button>
          </FormItem>
        </footer>
      </Form>
    </Modal>
  )
}

export default MedicationModal
