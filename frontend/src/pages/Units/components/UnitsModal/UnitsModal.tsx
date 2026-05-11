import { handleApiError } from '@/helpers/handleApiError'
import UnitsRepository from '@/repositories/UnitsRepository'
import { Col, Form, Input, InputNumber, message, Modal, Row } from 'antd'
import { useState } from 'react'

interface IUnitsModalProps {
  isModalOpen: boolean
  setIsModalOpen: (visible: boolean) => void
  fetchUnits: () => void
}

type ViaCepResponse = {
  erro?: boolean
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

async function lookupCep(raw: string): Promise<ViaCepResponse | null> {
  const digits = raw.replace(/\D/g, '')
  if (digits.length !== 8) return null
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    const data = (await res.json()) as ViaCepResponse
    if (data.erro) return null
    return data
  } catch {
    return null
  }
}

function UnitsModal({
  isModalOpen,
  setIsModalOpen,
  fetchUnits
}: IUnitsModalProps) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)

  const applyCepData = async (cepValue: string) => {
    setCepLoading(true)
    try {
      const data = await lookupCep(cepValue)
      if (!data) return
      form.setFieldsValue({
        street: data.logradouro ?? '',
        neighborhood: data.bairro ?? '',
        city: data.localidade ?? '',
        state: data.uf ?? ''
      })
    } finally {
      setCepLoading(false)
    }
  }

  const handleCreate = async (values: {
    name: string
    zipCode: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    maxOccupancy: number
    phone: string
  }) => {
    setSubmitting(true)

    try {
      const zipDigits = String(values.zipCode).replace(/\D/g, '')
      const phoneDigits = String(values.phone).replace(/\D/g, '')
      const numParsed = Number(String(values.number).replace(/\D/g, ''))

      const body = {
        name: values.name.trim(),
        maxOccupancy: values.maxOccupancy,
        phone: phoneDigits,
        partnerUnitIds: [],
        address: {
          street: values.street.trim(),
          number: Number.isFinite(numParsed) ? numParsed : 0,
          neighborhood: values.neighborhood.trim(),
          city: values.city.trim(),
          state: String(values.state).trim().toUpperCase().slice(0, 2),
          zipCode: Number(zipDigits)
        }
      }

      await UnitsRepository.createUnit({ body })
      message.success('Unidade cadastrada com sucesso!')
      setIsModalOpen(false)
      form.resetFields()
      fetchUnits()
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao cadastrar unidade' })
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
      <Form
        form={form}
        layout='vertical'
        initialValues={{ maxOccupancy: 50 }}
        onFinish={handleCreate}
      >
        <Form.Item
          name='name'
          label='Nome da Unidade'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <Input placeholder='Ex: UBS Centro' />
        </Form.Item>

        <Form.Item
          name='maxOccupancy'
          label='Capacidade máxima (ocupação)'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <InputNumber min={1} className='w-100' placeholder='Ex: 50' />
        </Form.Item>

        <Form.Item
          name='phone'
          label='Telefone da unidade'
          rules={[
            { required: true, message: 'Obrigatório' },
            {
              pattern: /^\d{10,11}$/,
              message: 'Informe 10 ou 11 dígitos (apenas números)'
            }
          ]}
        >
          <Input placeholder='Somente números, ex: 11999999999' maxLength={11} />
        </Form.Item>

        <div style={{ fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
          Endereço
        </div>

        <Form.Item
          name='zipCode'
          label='CEP'
          rules={[{ required: true, message: 'Obrigatório' }]}
        >
          <Input
            placeholder='00000-000'
            maxLength={9}
            disabled={cepLoading}
            onBlur={(e) => {
              void applyCepData(e.target.value)
            }}
            onPressEnter={(e) => {
              void applyCepData((e.target as HTMLInputElement).value)
            }}
          />
        </Form.Item>

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
              label='UF'
              rules={[{ required: true, message: 'Obrigatório' }]}
            >
              <Input placeholder='Ex: SP' maxLength={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default UnitsModal
