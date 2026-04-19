import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Flex, message } from 'antd'
import { useAuth } from '@/hooks/useAuth'
import { UserLevels } from '@/interfaces/IUser'
import { AttendanceRisk } from '@/interfaces/IAttendance'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import DetailsLine from '@/components/DetailsLine/DetailsLine'
import RiskTag from '@/components/RiskTag/RiskTag'
import SymptomTag from '@/components/SymptomTag/SymptomTag'
import { handleApiError } from '@/helpers/handleApiError'
import AttendancesFlowRepository from '@/repositories/AttendancesFlowRepository'
import { ROUTES } from '@/routes/constants'
import VitalCard from './components/VitalCard/VitalCard'
import RiskSelector from './components/RiskSelector/RiskSelector'
import styles from './ScreeningDetail.module.scss'

function ScreeningDetail() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { attendanceId } = useParams<{ attendanceId: string }>()
  const [triageLoading, setTriageLoading] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<AttendanceRisk>(AttendanceRisk.URGENT)
  const [observation, setObservation] = useState('')

  const isNurse = user?.level === UserLevels.NURSE

  // TODO: substituir por dados da API
  const patient = {
    name: 'Rafael Silva',
    age: 20,
    gender: 'Masculino',
    allergies: 'Dipirona',
    mainComplaint: 'Náusea',
    arrivalTime: '23:41',
    conditions: 'Hipertensão',
    risk: AttendanceRisk.URGENT,
  }

  const vitalSigns = {
    temperature: 0,
    bloodPressure: '0/0',
    respiratoryRate: 0,
    heartRate: 88,
    oxygenSaturation: 96,
    painScale: 7,
    weight: 72,
    height: 1.8,
  }

  const symptoms = ['Febre', 'Dor de cabeça', 'Dor no corpo', 'Fadiga', 'Calafrios']
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(symptoms)

  const handleToggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    )
  }

  async function handleFinalizeTriage() {
    if (!attendanceId) return
    try {
      setTriageLoading(true)
      await AttendancesFlowRepository.completeTriage({
        attendanceId: String(attendanceId),
      })
      message.success('Triagem finalizada. O paciente foi encaminhado à fila médica.')
      navigate(ROUTES.DASHBOARD.path)
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao finalizar a triagem.',
      })
    } finally {
      setTriageLoading(false)
    }
  }

  const headerActions = (
    <Flex gap={8} wrap='wrap' justify='flex-end'>
      {isNurse && attendanceId ? (
        <Button loading={triageLoading} onClick={handleFinalizeTriage}>
          Finalizar triagem
        </Button>
      ) : null}
    </Flex>
  )

  return (
    <section>
      <AuthLayoutHeader actionComponent={isNurse ? headerActions : undefined} />

      <div className={styles.page}>

        {/* ── Informações do Paciente ── */}
        <section>
          <h3 className={styles.sectionTitle}>Informações do Paciente</h3>
          <div className={styles.infoGrid}>
            <DetailsLine label='Nome' value={patient.name} />
            <DetailsLine label='Idade' value={`${patient.age} anos`} />
            <DetailsLine label='Sexo' value={patient.gender} />
            <DetailsLine label='Chegada' value={patient.arrivalTime} />
            <DetailsLine label='Queixa principal' value={patient.mainComplaint} />
            <DetailsLine label='Condições' value={patient.conditions} />
            <DetailsLine label='Alergias' value={patient.allergies} />
            <DetailsLine label='Risco' value={<RiskTag risk={patient.risk} />} />
          </div>
        </section>

        {/* ── Sintomas Relatados ── */}
        <section>
          <h3 className={styles.sectionTitle}>Sintomas Relatados</h3>
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

        {/* ── Sinais Vitais ── */}
        <section>
          <h3 className={styles.sectionTitle}>Sinais Vitais</h3>
          <div className={styles.vitalsGrid}>
            <VitalCard label='Temperatura' value={vitalSigns.temperature} suffix='°C' />
            <VitalCard label='Pressão Arterial' value={vitalSigns.bloodPressure} />
            <VitalCard label='Freq. Respiratória' value={vitalSigns.respiratoryRate} suffix=' irpm' />
            <VitalCard label='Fre. Cardíaca' value={vitalSigns.heartRate} suffix=' bpm' />
            <VitalCard label='Saturação O2' value={vitalSigns.oxygenSaturation} suffix='%' />
            <VitalCard label='Escala de Dor' value={vitalSigns.painScale} suffix='/10' />
            <VitalCard label='Peso' value={vitalSigns.weight} suffix=' kg' />
            <VitalCard label='Altura' value={vitalSigns.height} suffix=' m' />
          </div>
        </section>

        {/* ── Classificação de Risco ── */}
        <section>
          <h3 className={styles.sectionTitle}>Classificação de Risco</h3>
          <RiskSelector
            selected={selectedRisk}
            onChange={setSelectedRisk}
            disabled={!isNurse}
          />
        </section>

        {/* ── Observação Geral ── */}
        <section>
          <h3 className={styles.sectionTitle}>Observação geral</h3>
          <textarea
            className={styles.textarea}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            disabled={!isNurse}
            rows={4}
          />
        </section>

        {/* ── Footer ── */}
        {isNurse && (
          <div className={styles.footer}>
            <Button loading={triageLoading} onClick={handleFinalizeTriage}>
              Finalizar triagem
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ScreeningDetail
