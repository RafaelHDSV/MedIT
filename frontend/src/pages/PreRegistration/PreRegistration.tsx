import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import ProgressTag, { ProgressStatus } from '@/components/ProgressTag/ProgressTag'
import { Button, Flex, Input, Modal, Tag } from 'antd'
import { useState } from 'react'
import './PreRegistration.module.scss'



const sintomas = [
  'Febre', 'Dor de cabeça', 'Dor no corpo', 'Tosse', 'Náusea',
  'Fadiga', 'Dor de garganta', 'Calafrios', 'Falta de ar', 'Dor abdominal'
]

function PreRegistration() {
  const [sintomasSelecionados, setSintomasSelecionados] = useState<string[]>([])
  const [modalAberto, setModalAberto] = useState(false)

  const toggleSintoma = (sintoma: string) => {
    setSintomasSelecionados(prev =>
      prev.includes(sintoma) ? prev.filter(s => s !== sintoma) : [...prev, sintoma]
    )
  }

  return (
    <Flex gap={24} vertical style={{ padding: 32, width: '100%' }}>
      <AuthLayoutHeader />
      <ProgressTag status={ProgressStatus.NOT_STARTED} />

      {/* Informações básicas */}
          <Flex style={{ width: '100%' }} justify='space-between'>
        <Flex gap={70} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 8, minWidth: 200 }}>
          <b>Nome</b>
          <span style={{ color: '#888' }}>Rafael Silva</span>
        </Flex>
        <Flex gap={70} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 8, minWidth: 200 }}>
          <b>CPF</b>
          <span style={{ color: '#888' }}>123.456.789-00</span>
        </Flex>
        <Flex gap={70} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 8, minWidth: 200 }}>
          <b>Email</b>
          <span style={{ color: '#888' }}>rafael@gmail.com</span>
        </Flex>
        <Flex gap={70} style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 8, minWidth: 200 }}>
          <b>Chegada</b>
          <span style={{ color: '#888' }}>23:41</span>
        </Flex>
      </Flex>

      {/* Informações do Paciente */}
      <Flex vertical gap={40}>
        <h3 style={{ margin: 0 }}>Informações do Paciente</h3>
        <Flex gap={16}>
          <Flex vertical style={{ flex: 1 }}>
            <label>Data de nascimento</label>
            <Input />
          </Flex>
          <Flex vertical style={{ flex: 1 }}>
            <label>Sexo</label>
            <Input />
          </Flex>
          <Flex vertical style={{ flex: 1 }}>
            <label>Nível da dor (0 a 10)</label>
            <Input />
          </Flex>
        </Flex>
        <Flex gap={16}>
          <Flex vertical style={{ flex: 1 }}>
            <label>Queixa principal</label>
            <Input />
          </Flex>
          <Flex vertical style={{ flex: 1 }}>
            <label>Se automedicou?</label>
            <Input />
          </Flex>
          <Flex vertical style={{ flex: 1 }}>
            <label>Quando os sintomas começaram?</label>
            <Input />
          </Flex>
        </Flex>
        <Flex gap={16}>
          <Flex vertical style={{ flex: 1 }}>
            <label>Condições</label>
            <Input />
          </Flex>
          <Flex vertical style={{ flex: 1 }}>
            <label>Alergias</label>
            <Input />
          </Flex>
          <Flex vertical style={{ flex: 1 }}>
            <label>Observação geral</label>
            <Input />
          </Flex>
        </Flex>
      </Flex>

      {/* Sintomas */}
      <Flex vertical gap={12}>
        <h3 style={{ margin: 0 }}>Sintomas</h3>
        <Flex wrap='wrap' gap={8}>
          {sintomas.map(sintoma => (
            <Tag
              key={sintoma}
              onClick={() => toggleSintoma(sintoma)}
              style={{
                cursor: 'pointer',
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 14,
                borderColor: sintomasSelecionados.includes(sintoma) ? '#e05c3a' : '#ccc',
                color: sintomasSelecionados.includes(sintoma) ? '#e05c3a' : '#333',
                background: 'white',
              }}
            >
              {sintoma}
            </Tag>
          ))}
        </Flex>
      </Flex>

     {/* Modal */}
      <Modal
        open={modalAberto}
        onCancel={() => setModalAberto(false)}
        footer={null}
        centered
        width={450}
      >
        <Flex vertical gap={30}>
          <h2 style={{ textAlign: 'center', margin: 0 }}>Confirmação de consulta</h2>
          <Flex justify='space-between' style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}>
            <span><b>Queixa principal</b></span>
            <span style={{ color: '#888' }}>Náusea</span>
          </Flex>
          <Flex justify='space-between' style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}>
            <span><b>Os sintomas começaram</b></span>
            <span style={{ color: '#888' }}>08/03/2026</span>
          </Flex>
          <Flex justify='space-between' style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}>
            <span><b>Se automedicou?</b></span>
            <span style={{ color: '#888' }}>Não</span>
          </Flex>
          <Flex justify='space-between' style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 12 }}>
            <span><b>Nível de dor</b></span>
            <span style={{ color: '#888' }}>8</span>
          </Flex>
          <Flex justify='flex-end'>
            <Button
              type='primary'
              size='large'
              style={{ backgroundColor: '#e05c3a', borderColor: '#e05c3a', borderRadius: 8 }}
              onClick={() => setModalAberto(false)}
            >
              Confirmar consulta
            </Button>
          </Flex>
        </Flex>
      </Modal>

      {/* Botão finalizar */}
      <Flex justify='flex-end'>
        <Button
          type='primary'
          size='large'
          style={{ backgroundColor: '#e05c3a', borderColor: '#e05c3a', borderRadius: 8 }}
          onClick={() => setModalAberto(true)}
        >
          Finalizar pré-cadastro
        </Button>
      </Flex>

    </Flex>
  )
}

export default PreRegistration

