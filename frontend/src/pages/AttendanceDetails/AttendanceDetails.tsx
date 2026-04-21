import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import DetailsLine from '@/components/DetailsLine/DetailsLine'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import SymptomTag from '@/components/SymptomTag/SymptomTag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import { UserLevels } from '@/interfaces/IUser'
import AttendancesFlowRepository from '@/repositories/AttendancesFlowRepository'
import { ROUTES } from '@/routes/constants'
import { Flex, message } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RiskSelector from '../../components/Risk/RiskSelector/RiskSelector'
import styles from './AttendanceDetails.module.scss'
import ConditionsCard from './components/ConditionsCard/ConditionsCard'
import VitalCard from './components/VitalCard/VitalCard'

function AttendanceDetails() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { attendanceId } = useParams<{ attendanceId: string }>()

  const [triageLoading, setTriageLoading] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<AttendanceRisk>()
  const [observation, setObservation] = useState('')

  const isNurse = user?.level === UserLevels.NURSE
  const isDoctor = user?.level === UserLevels.DOCTOR

  // VIEIRA: Adicionar back
  const patient = {
    name: 'Rafael Silva',
    age: 20,
    gender: 'Masculino',
    allergies: 'Dipirona',
    mainComplaint: 'Náusea',
    arrivalTime: '23:41',
    risk: AttendanceRisk.URGENT,
    conditions: 'Hipertensão'
  }

  const vitalSigns = {
    temperature: 37.8,
    bloodPressure: '130/85',
    respiratoryRate: 18,
    heartRate: 88,
    oxygenSaturation: 96,
    painScale: 7
  }

  // VIEIRA: Adicionar todas os sintomas possíveis
  const symptoms = [
    'Febre',
    'Dor de cabeça',
    'Dor no corpo',
    'Fadiga',
    'Calafrios'
  ]
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(symptoms)

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  // VIEIRA: Adicionar back
  const suggestedConditions = [
    { name: 'Dengue', compatibility: 87 },
    { name: 'Gripe (Influenza)', compatibility: 72 },
    { name: 'COVID-19', compatibility: 58 },
    { name: 'Chikungunya', compatibility: 41 }
    // { name: 'Catapora', compatibility: 21 },
    // { name: 'Caxumba', compatibility: 11 }
  ]

  async function handleCompleteTriage() {
    if (!attendanceId) return
    try {
      setTriageLoading(true)
      await AttendancesFlowRepository.completeTriage({
        attendanceId: String(attendanceId)
      })
      message.success(
        'Triagem concluída. O paciente foi encaminhado à fila médica.'
      )
      navigate(ROUTES.DASHBOARD.path)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao concluir a triagem.'
      })
    } finally {
      setTriageLoading(false)
    }
  }

  const headerActions = (
    <Flex gap={8} wrap='wrap' justify='flex-end'>
      {isNurse && attendanceId ? (
        <Button loading={triageLoading} onClick={handleCompleteTriage}>
          Concluir triagem
        </Button>
      ) : null}
      {isDoctor ? <Button>Finalizar atendimento</Button> : null}
    </Flex>
  )

  return (
    <section>
      {/* VIEIRA: Adicionar Triagem e Atendimento no nome e descrição */}
      <AuthLayoutHeader
        actionComponent={isNurse || isDoctor ? headerActions : undefined}
      />

      <div
        className={styles.page}
        style={{ gridTemplateColumns: isNurse ? '1fr' : '1fr 20rem' }}
      >
        <div className={styles.mainContent}>
          <section>
            <h3 className={styles.title}>Informações do Paciente</h3>

            <div className={styles.grid}>
              <DetailsLine label='Nome' value={patient.name} />
              <DetailsLine label='Idade' value={`${patient.age} anos`} />
              <DetailsLine label='Sexo' value={patient.gender} />
              <DetailsLine label='Alergias' value={patient.allergies} />
              <DetailsLine
                label='Queixa principal'
                value={patient.mainComplaint}
              />
              <DetailsLine label='Chegada' value={patient.arrivalTime} />
              {!isNurse && (
                <DetailsLine
                  label='Risco'
                  value={<RiskTag risk={patient.risk} />}
                />
              )}
              <DetailsLine label='Condições' value={patient.conditions} />
            </div>
          </section>

          <section>
            <h3 className={styles.title}>Sinais Vitais</h3>

            <div className={styles.grid}>
              <VitalCard
                label='Temperatura'
                value={vitalSigns.temperature}
                suffix='°'
              />
              <VitalCard
                label='Pressão Arterial'
                value={vitalSigns.bloodPressure}
              />
              <VitalCard
                label='Freq. Respiratória'
                value={vitalSigns.respiratoryRate}
                suffix=' irpm'
              />
              <VitalCard
                label='Fre. Cardíaca'
                value={vitalSigns.heartRate}
                suffix=' bpm'
              />
              <VitalCard
                label='Saturação O2'
                value={vitalSigns.oxygenSaturation}
                suffix='%'
              />
              <VitalCard
                label='Escala de Dor'
                value={vitalSigns.painScale}
                suffix='/10'
              />
            </div>
          </section>

          <section>
            <h3 className={styles.title}>Sintomas Relatados</h3>

            <div className={styles.symptoms}>
              {symptoms.map((symptom) => (
                <SymptomTag
                  key={symptom}
                  symptom={symptom}
                  clickable={isNurse}
                  selected={selectedSymptoms.includes(symptom)}
                  onClick={() => handleToggleSymptom(symptom)}
                />
              ))}
            </div>
          </section>
        </div>

        {!isNurse && (
          <div className={styles.sidebar}>
            <h3 className={styles.title}>Condições sugeridas</h3>

            {suggestedConditions.map((condition) => (
              <ConditionsCard
                key={`${condition.name}_${condition.compatibility}`}
                name={condition.name}
                compatibility={condition.compatibility}
              />
            ))}
          </div>
        )}

        {isNurse && (
          <>
            <section>
              <h3 className={styles.title}>Classificação de Risco</h3>
              <RiskSelector
                selected={selectedRisk}
                onChange={setSelectedRisk}
                disabled={!isNurse}
              />
            </section>

            <section>
              <h3 className={styles.title}>Observação geral</h3>
              <textarea
                className={styles.textarea}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                disabled={!isNurse}
                rows={4}
              />
            </section>
          </>
        )}
      </div>
    </section>
  )
}

export default AttendanceDetails
