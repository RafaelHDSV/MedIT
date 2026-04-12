import { api } from '@/api/api'
import { InputSelect } from '@/components/FormComponents/FormComponents'
import { MedicationAvailabilityStatusLabels } from '@/interfaces/IMedication'
import { Form, Input, InputNumber, message, Modal, Switch } from 'antd'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

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

  const handleCreate = async (values: any) => {
    setLoading(true)
    try {
      await api.post('/auth/medications', { ...values, unitId })
      message.success('Medicamento cadastrado com sucesso!')
      setIsModalOpen(false)
      form.resetFields()
      fetchMedications()
    } catch {
      message.error('Erro ao cadastrar medicamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title='Cadastrar Medicamento'
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText='Salvar'
      cancelText='Cancelar'
    >
      <Form form={form} layout='vertical' onFinish={handleCreate}>
        <Form.Item
          name='name'
          label='Nome do Medicamento'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <Input placeholder='Ex: Paracetamol 500mg' />
        </Form.Item>
        <Form.Item
          name='category'
          label='Categoria'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <Input placeholder='Ex: Analgésico e antitérmico' />
        </Form.Item>
        <Form.Item name='description' label='Descrição'>
          <Input.TextArea placeholder='Descrição do medicamento' rows={3} />
        </Form.Item>
        <Form.Item
          name='requiresPrescription'
          label='Necessita de Receita Médica?'
          valuePropName='checked'
          initialValue={false}
        >
          <Switch checkedChildren='Sim' unCheckedChildren='Não' />
        </Form.Item>
        <Form.Item
          name='availabilityStatus'
          label='Status'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <InputSelect
            placeholder='Selecione o status'
            options={Object.entries(MedicationAvailabilityStatusLabels).map(
              ([key, value]) => ({
                label: value,
                value: key
              })
            )}
          />
        </Form.Item>
        <Form.Item
          name='stockQuantity'
          label='Quantidade em Estoque'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default MedicationModal
