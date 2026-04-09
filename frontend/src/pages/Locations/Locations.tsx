import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { ILocation } from '@/interfaces/ILocation'
import { Col, Form, Input, message, Modal, Row, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Locations.module.scss'

function Locations() {
  const { user } = useAuth()
  const [locations, setLocations] = useState<ILocation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  // VIEIRA: Verificar possibilidade de nível Medit
  const isMedit = false

  async function fetchLocations() {
    try {
      const response = await api.get('/auth/units')
      setLocations(response.data.data)
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao buscar localizações' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

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

  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatus = () => {
    // Basic mock for status based on hours, since we don't have full logic here
    const random = Math.random()
    if (random > 0.6) return { text: 'Aberto', className: styles.aberto }
    if (random > 0.3) return { text: 'Fechando', className: styles.fechando }
    return { text: 'Fechado', className: styles.fechado }
  }

  return (
    <>
      <AuthLayoutHeader
        actionComponent={
          isMedit && (
            <Button onClick={() => setIsModalOpen(true)}>
              Adicionar Unidade
            </Button>
          )
        }
      />

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
      <div className={styles.container}>
        <div className={styles.header}>
          <input
            type='text'
            placeholder='Buscar localização...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.loader}>
            <Spin size='large' />
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredLocations.map((location) => {
              const status = getStatus()
              return (
                <div
                  key={location._id}
                  className={styles.card}
                  onClick={() => navigate(`/auth/medications/${location._id}`)}
                >
                  <div className={styles.cardHeader}>
                    <h3>{location.name}</h3>
                    <span className={`${styles.badge} ${status.className}`}>
                      {status.text}
                    </span>
                  </div>
                  {location.scale && (
                    <p
                      style={{
                        margin: '4px 0',
                        fontSize: '14px',
                        color: '#666'
                      }}
                    >
                      <strong>Escala:</strong> {location.scale}
                    </p>
                  )}
                  <p className={styles.address}>{location.address}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default Locations
