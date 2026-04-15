import DeleteModal from '@/components/DeleteModal/DeleteModal'
import { useAuth } from '@/hooks/useAuth'
import { DoctorSpecializationsLabels } from '@/interfaces/IDoctor'
import { UserLevelsLabels } from '@/interfaces/IUser'
import { Input, Modal, Typography } from 'antd'
import styles from './ConfigModal.module.scss'

function ConfigBaseContent() {
  const { user } = useAuth()
  if (!user) return null

  const userData = user as any

  // Normaliza o level vindo do banco
  const userLevel = String(userData.level).toUpperCase()

  const isAdmin = userLevel === 'ADMIN'
  const isPatient = userLevel === 'PATIENT'
  const isDoctor = userLevel === 'DOCTOR'
  const isNurse = userLevel === 'NURSE'

  // Formatação de data (suporta $date do Mongo ou string direta)
  const dataRaw = userData.birthDate?.$date || userData.birthDate
  const dataFormatada = dataRaw
    ? new Date(dataRaw).toLocaleDateString('pt-BR')
    : '---'

  // Formatação de telefone
  const telefone =
    userData.cellphone?.$numberLong || userData.cellphone || '---'

  const formatGender = (gender: string) => {
    const map: any = {
      male: 'Masculino',
      female: 'Feminino',
      other: 'Outro'
    }
    return map[gender?.toLowerCase()] || gender || '---'
  }

  return (
    <div className={styles.baseContent}>
      <div className={styles.infoSection}>
        <Typography.Text type='secondary' className={styles.sectionLabel}>
          Informações básicas
        </Typography.Text>

        {isAdmin ? (
          /* DESIGN ADMINISTRADOR: Incluindo Data de Nascimento e Sexo */
          <div className={styles.infoGridAdmin}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Nome</span>
              <span className={styles.value}>{userData.name}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>CPF</span>
              <span className={styles.value}>{userData.cpf}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>E-mail</span>
              <span className={styles.value}>{userData.email}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Sexo</span>
              <span className={styles.value}>
                {formatGender(userData.gender)}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.label}>Nascimento</span>
              <span className={styles.value}>{dataFormatada}</span>
            </div>
          </div>
        ) : (
          /* DESIGN OUTROS USUÁRIOS */
          <div className={styles.inputGrid}>
            <div className={styles.inputGroup}>
              <label>Nome</label>
              <Input value={userData.name} disabled />
            </div>
            <div className={styles.inputGroup}>
              <label>CPF</label>
              <Input value={userData.cpf} disabled />
            </div>
            <div className={styles.inputGroup}>
              <label>Sexo</label>
              <Input value={formatGender(userData.gender)} disabled />
            </div>
            <div className={styles.inputGroup}>
              <label>Data de Nascimento</label>
              <Input value={dataFormatada} disabled />
            </div>
            {isPatient && (
              <div className={styles.inputGroup}>
                <label>Telefone</label>
                <Input value={telefone} />
              </div>
            )}
          </div>
        )}
      </div>

      {(isDoctor || isNurse) && (
        <div className={styles.infoSection}>
          <Typography.Text type='secondary' className={styles.sectionLabel}>
            Informações alteráveis
          </Typography.Text>
          <div className={styles.inputGridHorizontal}>
            {isDoctor && (
              <>
                <div className={styles.inputGroup}>
                  <label>CRM</label>
                  <Input value={userData.crm || '---'} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Especialidade</label>
                  <Input
                    value={
                      DoctorSpecializationsLabels[
                        userData.specialization as keyof typeof DoctorSpecializationsLabels
                      ] ||
                      userData.specialization ||
                      '---'
                    }
                  />
                </div>
              </>
            )}
            {isNurse && (
              <div className={styles.inputGroup}>
                <label>COREN</label>
                <Input value={userData.coren || '---'} />
              </div>
            )}
            <div className={styles.inputGroup}>
              <label>Telefone</label>
              <Input value={telefone} />
            </div>
          </div>
        </div>
      )}

      <div className={styles.deleteArea}>
        <DeleteModal
          user={userData}
          label='usuário'
          apiName='users'
          buttonText='Encerrar conta'
        />
      </div>
    </div>
  )
}

interface IConfigModalProps {
  isModalOpen: boolean
  setIsModalOpen: (bool: boolean) => void
}

export default function ConfigModal({
  isModalOpen,
  setIsModalOpen
}: IConfigModalProps) {
  const { user } = useAuth()
  const userLevel = String(user?.level).toUpperCase()
  const isAdmin = userLevel === 'ADMIN'

  return (
    <Modal
      title={
        <Typography.Title level={3} style={{ margin: 0, textAlign: 'center' }}>
          Configuração do{' '}
          {UserLevelsLabels[userLevel as keyof typeof UserLevelsLabels] ||
            'Usuário'}
        </Typography.Title>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      centered
      width={isAdmin ? 500 : 750}
    >
      <div className={styles.modalBody}>
        <ConfigBaseContent />
      </div>
    </Modal>
  )
}
