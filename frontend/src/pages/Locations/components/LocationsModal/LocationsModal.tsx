import { api } from '@/api/api'
import { Col, Form, Input, message, Modal, Row } from 'antd'
import { useState } from 'react'

// VIEIRA: Verificar possibilidade de nível Medit
interface ILocationsModalProps {
  isModalOpen: boolean
  setIsModalOpen: (visible: boolean) => void
  fetchLocations: () => void
}

function LocationsModal({
  isModalOpen,
  setIsModalOpen,
  fetchLocations
}: ILocationsModalProps) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (values: any) => {
    setSubmitting(true)

    try {
      const addressString = `${values.street}, ${values.number} - ${values.neighborhood}, ${values.city} - ${values.state}, CEP: ${values.zipCode}`
      const submissionData = {
        name: values.name,
        scale: values.scale,
        address: addressString
      }
      await api.post('/units', submissionData)
      message.success('Unidade cadastrada com sucesso!')
      setIsModalOpen(false)
      form.resetFields()
      fetchLocations()
    } catch {
      message.error('Erro ao cadastrar unidade')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title='Cadastrar Unidade'
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={() => form.submit()}
      confirmLoading={submitting}
      okText='Salvar'
      cancelText='Cancelar'
    >
      <Form form={form} layout='vertical' onFinish={handleCreate}>
        <Form.Item
          name='name'
          label='Nome da Unidade'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <Input placeholder='Ex: UBS Centro' />
        </Form.Item>
        <Form.Item
          name='scale'
          label='Escala'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <Input placeholder='Ex: 24 horas, 12x36' />
        </Form.Item>
        <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
          Endereço
        </div>
        <Row gutter={12}>
          <Col span={18}>
            <Form.Item
              name='street'
              label='Rua'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <Input placeholder='Ex: Rua das Flores' />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name='number'
              label='Número'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <Input placeholder='Ex: 123' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name='neighborhood'
              label='Bairro'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <Input placeholder='Ex: Centro' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='city'
              label='Cidade'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <Input placeholder='Ex: São Paulo' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name='state'
              label='Estado'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <Input placeholder='Ex: SP' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name='zipCode'
              label='CEP'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <Input placeholder='Ex: 00000-000' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default LocationsModal
