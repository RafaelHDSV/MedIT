import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import DetailsLine from '@/components/DetailsLine/DetailsLine'
import Empty from '@/components/Empty/Empty'
import RiskTag from '@/components/Risk/RiskTag/RiskTag'
import SymptomTag from '@/components/SymptomTag/SymptomTag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import {
  AttendanceRisk,
  type IAttendanceDetails
} from '@/interfaces/IAttendance'
import type {
  ISuggestedDiseases,
  ISuggestionDetails,
  ISymptomOption
} from '@/interfaces/ISymptomDiseases'
import { UserGendersLabels, UserLevels } from '@/interfaces/IUser'
import AttendancesFlowRepository from '@/repositories/AttendancesFlowRepository'
import SymptomsDiseasesRepository from '@/repositories/SymptomsDiseasesRepository'
import { ROUTES } from '@/routes/constants'
import buildSymptomLabelMap from '@/utils/buildSymptomLabelMap'
import getAgeByBirthDate from '@/utils/getAgeByBirthDate'
import { Flex, message, Spin } from 'antd'
import dayjs from 'dayjs'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import RiskSelector from '../../components/Risk/RiskSelector/RiskSelector'
import styles from './AttendanceDetails.module.scss'
import ConditionsCard from './components/ConditionsCard/ConditionsCard'
import SuggestionDetailModal from './components/SuggestionDetailModal/SuggestionDetailModal'
import VitalCard from './components/VitalCard/VitalCard'

function AttendanceDetails() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { attendanceId } = useParams<{ attendanceId: string }>()

  const [triageLoading, setTriageLoading] = useState(false)
  const [selectedRisk, setSelectedRisk] = useState<AttendanceRisk>()
  const [observation, setObservation] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [attendance, setAttendance] = useState<IAttendanceDetails | null>(null)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<ISuggestedDiseases[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [suggestionDetail, setSuggestionDetail] =
    useState<ISuggestionDetails | null>(null)
  const [symptomOptions, setSymptomOptions] = useState<ISymptomOption[]>([])

  const symptomLabelByKey = useMemo(
    () => buildSymptomLabelMap(symptomOptions),
    [symptomOptions]
  )

  const isNurse = user?.level === UserLevels.NURSE
  const isDoctor = user?.level === UserLevels.DOCTOR

  const loadAttendance = useCallback(async () => {
    if (!attendanceId) return
    try {
      setPageLoading(true)
      const response = await AttendancesFlowRepository.getAttendanceDetails({
        attendanceId
      })
      const data = response.data
      const { risk, generalObservation } = data
      setAttendance(data)
      setSelectedRisk(risk)
      setObservation(generalObservation ?? '')
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Não foi possível carregar o atendimento.'
      })
      setAttendance(null)
    } finally {
      setPageLoading(false)
    }
  }, [attendanceId])

  const loadSuggestions = useCallback(async () => {
    if (!attendanceId || !isDoctor) return
    try {
      setSuggestionsLoading(true)
      const response = await AttendancesFlowRepository.getSuggestedDiseases({
        attendanceId
      })
      setSuggestions(response.data.suggestions ?? [])
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Não foi possível carregar sugestões da IA simbólica.'
      })
      setSuggestions([])
    } finally {
      setSuggestionsLoading(false)
    }
  }, [attendanceId, isDoctor])

  /** Normaliza valores gravados no atendimento (chave ou rótulo) para chaves canónicas. */
  function normalizeStoredSymptoms(
    raw: string[] | undefined,
    options: ISymptomOption[]
  ): string[] {
    if (!raw?.length || !options.length) return []
    const keys = new Set<string>()
    for (const entry of raw) {
      const t = typeof entry === 'string' ? entry.trim() : ''
      if (!t) continue
      const byKey = options.find((o) => o.key === t)
      const byLabel = options.find((o) => o.label === t)
      if (byKey) keys.add(byKey.key)
      else if (byLabel) keys.add(byLabel.key)
    }
    return [...keys]
  }

  useEffect(() => {
    loadAttendance()
  }, [loadAttendance])

  useEffect(() => {
    async function fetchSymptomOptions() {
      try {
        const response = await SymptomsDiseasesRepository.getSymptomOptions()
        setSymptomOptions(response.data.symptoms ?? [])
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Não foi possível carregar a lista de sintomas.'
        })
      }
    }

    fetchSymptomOptions()
  }, [])

  useEffect(() => {
    if (!attendance?.symptoms || !symptomOptions.length) return
    setSelectedSymptoms(
      normalizeStoredSymptoms(attendance.symptoms, symptomOptions)
    )
  }, [attendance, symptomOptions])

  useEffect(() => {
    if (!isDoctor) {
      setSuggestions([])
      return
    }

    loadSuggestions()
  }, [loadSuggestions, isDoctor])

  const openSuggestionDetail = useCallback(
    async (disease: string) => {
      if (!attendanceId) return

      setDetailModalOpen(true)
      setDetailLoading(true)
      setSuggestionDetail(null)

      try {
        const response = await AttendancesFlowRepository.getSuggestionDetail({
          attendanceId,
          disease
        })
        setSuggestionDetail(response.data)
      } catch (err) {
        handleApiError({
          err,
          defaultMessage: 'Não foi possível carregar o detalhe da sugestão.'
        })
        setDetailModalOpen(false)
      } finally {
        setDetailLoading(false)
      }
    },
    [attendanceId]
  )

  const closeSuggestionDetail = useCallback(() => {
    setDetailModalOpen(false)
    setSuggestionDetail(null)
  }, [])

  const patient = attendance?.patient
  const patientName = patient?.name ?? '—'
  const patientAge = patient?.birthDate
    ? `${getAgeByBirthDate(patient.birthDate)} anos`
    : '—'
  const patientGender = patient?.gender
    ? (UserGendersLabels[patient.gender as keyof typeof UserGendersLabels] ??
      patient.gender)
    : '—'
  const arrivalLabel = attendance?.date
    ? dayjs(attendance.date).format('DD/MM/YYYY HH:mm')
    : '—'
  const vitalSigns = attendance?.vitalSigns

  const allergiesText = useMemo(() => {
    const allergies = patient?.allergies?.length
      ? patient.allergies.join(', ')
      : attendance?.allergies?.length
        ? attendance.allergies.join(', ')
        : undefined
    return allergies ?? '—'
  }, [patient?.allergies, attendance?.allergies])

  const conditionsText = useMemo(() => {
    const conditions = patient?.conditions?.length
      ? patient.conditions.join(', ')
      : attendance?.conditions?.length
        ? attendance.conditions.join(', ')
        : undefined
    return conditions ?? '—'
  }, [patient?.conditions, attendance?.conditions])

  const handleToggleSymptom = (symptomKey: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomKey)
        ? prev.filter((symptomPrev) => symptomPrev !== symptomKey)
        : [...prev, symptomKey]
    )
  }

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

  if (pageLoading) {
    return (
      <section className={styles.page}>
        <AuthLayoutHeader
          actionComponent={isNurse || isDoctor ? headerActions : undefined}
        />
        <Flex justify='center' align='center' style={{ minHeight: 240 }}>
          <Spin size='large' />
        </Flex>
      </section>
    )
  }

  if (!attendance) {
    return (
      <section>
        <AuthLayoutHeader />
        <Empty message='Não foi possível exibir este atendimento.' />
      </section>
    )
  }

  return (
    <>
      <SuggestionDetailModal
        open={detailModalOpen}
        onClose={closeSuggestionDetail}
        loading={detailLoading}
        detail={suggestionDetail}
        medications={suggestionDetail?.medications ?? []}
        exams={suggestionDetail?.exams ?? []}
        symptomLabelByKey={symptomLabelByKey}
      />

      <section>
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
                <DetailsLine label='Nome' value={patientName} />
                <DetailsLine label='Idade' value={patientAge} />
                <DetailsLine label='Sexo' value={patientGender} />
                <DetailsLine label='Alergias' value={allergiesText} />
                <DetailsLine
                  label='Queixa principal'
                  value={attendance.complaint}
                />
                <DetailsLine label='Chegada' value={arrivalLabel} />
                {!isNurse && attendance.risk ? (
                  <DetailsLine
                    label='Risco'
                    value={<RiskTag risk={attendance.risk} />}
                  />
                ) : null}
                <DetailsLine label='Condições' value={conditionsText} />
              </div>
            </section>

            <section>
              <h3 className={styles.title}>Sinais Vitais</h3>

              <div className={styles.grid}>
                <VitalCard
                  label='Temperatura'
                  value={
                    vitalSigns?.temperature !== undefined &&
                    vitalSigns?.temperature !== null
                      ? vitalSigns.temperature
                      : '—'
                  }
                  suffix='°'
                />
                <VitalCard
                  label='Pressão Arterial'
                  value={vitalSigns?.bloodPressure ?? '—'}
                />
                <VitalCard
                  label='Fre. Cardíaca'
                  value={
                    vitalSigns?.heartRate !== undefined &&
                    vitalSigns?.heartRate !== null
                      ? vitalSigns.heartRate
                      : '—'
                  }
                  suffix=' bpm'
                />
                <VitalCard
                  label='Saturação O2'
                  value={
                    vitalSigns?.oxygenSaturation !== undefined &&
                    vitalSigns?.oxygenSaturation !== null
                      ? vitalSigns.oxygenSaturation
                      : '—'
                  }
                  suffix='%'
                />
                <VitalCard
                  label='Escala de Dor'
                  value={
                    attendance.painLevel !== undefined &&
                    attendance.painLevel !== null
                      ? attendance.painLevel
                      : '—'
                  }
                  suffix='/10'
                />
              </div>
            </section>

            <section>
              <h3 className={styles.title}>Sintomas relatados</h3>

              <div className={styles.symptoms}>
                {symptomOptions.map(({ key, label }) => (
                  <SymptomTag
                    key={key}
                    symptom={label}
                    clickable={isNurse}
                    selected={selectedSymptoms.includes(key)}
                    onClick={() => handleToggleSymptom(key)}
                  />
                ))}
              </div>
            </section>
          </div>

          {!isNurse && (
            <div className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <h3 className={styles.title}>Condições sugeridas</h3>
                <p className={styles.aiHint}>
                  Apoio à decisão clínica com base nos sintomas registrados no
                  atendimento.
                </p>
              </div>

              <div className={styles.sidebarList}>
                {suggestionsLoading ? (
                  <Flex justify='center' style={{ padding: '1.5rem 0' }}>
                    <Spin />
                  </Flex>
                ) : suggestions.length === 0 ? (
                  <p className={styles.aiEmpty}>
                    Nenhuma sugestão com base nos sintomas mapeados ou ainda não
                    há sintomas suficientes na base.
                  </p>
                ) : (
                  suggestions.map((condition) => (
                    <ConditionsCard
                      key={`${condition.disease}_${condition.compatibility}`}
                      name={condition.disease}
                      compatibility={condition.compatibility}
                      onOpenDetail={() =>
                        void openSuggestionDetail(condition.disease)
                      }
                    />
                  ))
                )}
              </div>
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
    </>
  )
}

export default AttendanceDetails
