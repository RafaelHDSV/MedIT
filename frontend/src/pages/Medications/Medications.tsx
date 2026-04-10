import { api } from '@/api/api'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import { InputSelect } from '@/components/FormComponents/FormComponents'
import { useAuth } from '@/hooks/useAuth'
import type { IMedication } from '@/interfaces/IMedication'
import {
  MedicationAvailabilityStatus,
  MedicationAvailabilityStatusLabels
} from '@/interfaces/IMedication'
import type { IUnit } from '@/interfaces/IUnit'
import { UserLevels } from '@/interfaces/IUser'
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Spin,
  Switch
} from 'antd'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Medications.module.scss'

function Medications() {
  const { user } = useAuth()
  const location = useLocation()
  const unitId = user?.unitId
  const [unit, setUnit] = useState<IUnit | null>(null)
  const [medications, setMedications] = useState<IMedication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] =
    useState<IMedication | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  async function fetchUnitInfo() {
    try {
      const response = await api.get(`/units/${unitId}`)
      setUnit(response.data.data)
    } catch {
      message.error('Erro ao buscar unidade')
    }
  }

  async function fetchMedications() {
    setLoading(true)
    try {
      const response = await api.get(`/medications/unit/${unitId}`)
      setMedications(response.data.data)
    } catch {
      message.error('Erro ao buscar medicamentos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (unitId) {
      fetchUnitInfo()
      fetchMedications()
    }
  }, [unitId])

  const filteredMedications = medications.filter(
    (med) =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async (values: any) => {
    setSubmitting(true)
    try {
      await api.post('/medications', { ...values, unitId })
      message.success('Medicamento cadastrado com sucesso!')
      setIsModalOpen(false)
      form.resetFields()
      fetchMedications()
    } catch {
      message.error('Erro ao cadastrar medicamento')
    } finally {
      setSubmitting(false)
    }
  }

  const getBadgeClass = (status: MedicationAvailabilityStatus) => {
    switch (status) {
      case MedicationAvailabilityStatus.AVAILABLE:
        return styles.available
      case MedicationAvailabilityStatus.LOW_STOCK:
        return styles.lowStock
      case MedicationAvailabilityStatus.UNAVAILABLE:
        return styles.unavailable
      default:
        return ''
    }
  }

  return (
    <>
      <AuthLayoutHeader
        actionComponent={
          user?.level === UserLevels.ADMIN ? (
            <Button type='primary' onClick={() => setIsModalOpen(true)}>
              Adicionar Medicamento
            </Button>
          ) : undefined
        }
      />

      <Modal
        title='Cadastrar Medicamento'
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

      <Modal
        title='Detalhes do Medicamento'
        open={isDetailsModalOpen}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={[
          <Button key='close' onClick={() => setIsDetailsModalOpen(false)}>
            Fechar
          </Button>
        ]}
      >
        {selectedMedication && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div
              style={{
                padding: '12px',
                backgroundColor: selectedMedication.requiresPrescription
                  ? '#fff1f0'
                  : '#f6ffed',
                border: `1px solid ${selectedMedication.requiresPrescription ? '#ffa39e' : '#b7eb8f'}`,
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 500,
                color: selectedMedication.requiresPrescription
                  ? '#cf1322'
                  : '#389e0d'
              }}
            >
              <span style={{ fontSize: '18px' }}>
                {selectedMedication.requiresPrescription ? '⚠️' : '✅'}
              </span>
              {selectedMedication.requiresPrescription
                ? 'Venda sob prescrição médica.'
                : 'Medicamento de livre acesso / venda livre.'}
            </div>

            <div>
              <strong>Nome:</strong> {selectedMedication.name}
            </div>
            <div>
              <strong>Categoria:</strong> {selectedMedication.category}
            </div>
            <div>
              <strong>Status:</strong> {selectedMedication.availabilityStatus}
            </div>
            <div>
              <strong>Estoque:</strong> {selectedMedication.stockQuantity} un.
            </div>
            <div>
              <strong>Descrição:</strong>
              <p style={{ marginTop: '4px', whiteSpace: 'pre-wrap' }}>
                {selectedMedication.description ||
                  'Nenhuma descrição disponível.'}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h2>Medicamentos</h2>
            {unit && (
              <span className={styles.subtitle}>
                {unit.name} - {unit.address}
              </span>
            )}
          </div>
          <input
            type='text'
            placeholder='Buscar medicamento'
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
            {filteredMedications.map((med) => (
              <div
                key={med._id}
                className={styles.card}
                onClick={() => {
                  setSelectedMedication(med)
                  setIsDetailsModalOpen(true)
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardInfo}>
                  <h3>{med.name}</h3>
                  <p>{med.category}</p>
                </div>
                <div className={styles.cardFooter}>
                  <span
                    className={`${styles.badge} ${getBadgeClass(med.availabilityStatus)}`}
                  >
                    {med.availabilityStatus}
                  </span>
                  <span className={styles.quantity}>
                    {med.stockQuantity} un.
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Medications
