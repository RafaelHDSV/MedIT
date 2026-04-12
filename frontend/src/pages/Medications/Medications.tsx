import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import Empty from '@/components/Empty/Empty'
import { FormItem, InputText } from '@/components/FormComponents/FormComponents'
import { LayoutSpinner } from '@/components/LayoutSpinner/LayoutSpinner'
import Tag from '@/components/Tag/Tag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IMedication } from '@/interfaces/IMedication'
import {
  MedicationAvailabilityStatusLabels,
  MedicationCategoriesLabels
} from '@/interfaces/IMedication'
import type { IUnit } from '@/interfaces/IUnit'
import MedicationModel from '@/models/MedicationModel'
import MedicationsRepository from '@/repositories/MedicationsRepository'
import UnitsRepository from '@/repositories/UnitsRepository'
import { ROUTES } from '@/routes/constants'
import getFullAddress from '@/utils/getFullAddress'
import masks from '@/utils/masks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import styles from './Medications.module.scss'
import MedicationDetailsModal from './components/MedicationDetailsModal/MedicationDetailsModal'
import MedicationModal from './components/MedicationModal/MedicationModal'
import { MEDICATIONS_STATUS_MAP } from './medicationsConstants'

function Medications() {
  const { user } = useAuth()
  const { unitId } = useParams()
  const navigate = useNavigate()

  const [unit, setUnit] = useState<IUnit | undefined>()
  const [medications, setMedications] = useState<IMedication[]>([])
  const [unitsLoading, setUnitsLoading] = useState(true)
  const [medicationsLoading, setMedicationsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<
    IMedication | undefined
  >()

  const loading = unitsLoading || medicationsLoading
  const canAddMedication = MedicationModel.canAddMedication(user?.level)
  const description = `${unit?.name} - ${getFullAddress(unit?.address)}`

  const fetchUnitInfo = useCallback(async () => {
    setUnitsLoading(true)

    try {
      const response = await UnitsRepository.getUnit({ id: unitId })
      setUnit(response.data)
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao buscar unidade' })
    } finally {
      setUnitsLoading(false)
    }
  }, [unitId])

  const fetchMedications = useCallback(async () => {
    setMedicationsLoading(true)

    try {
      const response = await MedicationsRepository.getMedications({ unitId })
      setMedications(response.data)
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao buscar medicamentos' })
    } finally {
      setMedicationsLoading(false)
    }
  }, [unitId])

  useEffect(() => {
    const hasUnitId = unitId !== ':unitId'

    if (hasUnitId) {
      fetchUnitInfo()
      fetchMedications()
    } else {
      if (user?.unitId) {
        navigate(ROUTES.MEDICAMENTS.path.replace(':unitId', user?.unitId))
      }
    }
  }, [unitId, user?.unitId, fetchUnitInfo, fetchMedications, navigate])

  const filteredMedications = useMemo(() => {
    if (!searchTerm || searchTerm === '') return medications
    const search = searchTerm.toLowerCase()

    return medications?.filter(
      (medication) =>
        medication.name.toLowerCase().includes(search) ||
        medication.category.toLowerCase().includes(search)
    )
  }, [searchTerm, medications])

  function handleGoBack() {
    navigate(ROUTES.UNITS.path)
  }

  function content() {
    if (loading) {
      return <LayoutSpinner />
    }

    if (!medications || medications.length === 0) {
      return <Empty />
    }

    return (
      <div className={styles.grid}>
        {filteredMedications?.map((medication) => (
          <div
            key={String(medication._id)}
            className={styles.card}
            onClick={() => {
              setSelectedMedication(medication)
            }}
          >
            <div className={styles.cardInfo}>
              <span className={styles.title}>{medication.name}</span>
              <span className={styles.subtitle}>
                {MedicationCategoriesLabels[medication.category]}
              </span>
            </div>

            <div className={styles.cardFooter}>
              <Tag
                status={MEDICATIONS_STATUS_MAP[medication.availabilityStatus]}
                fontSize={12}
              >
                {
                  MedicationAvailabilityStatusLabels[
                    medication.availabilityStatus
                  ]
                }
              </Tag>

              <span className={styles.quantity}>
                {medication.stockQuantity === 0
                  ? 'Sem medicamentos'
                  : `${masks(medication.stockQuantity, 'number')} un.`}
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <MedicationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchMedications={fetchMedications}
      />

      <MedicationDetailsModal
        selectedMedication={selectedMedication}
        setSelectedMedication={setSelectedMedication}
      />

      <section>
        <AuthLayoutHeader
          description={description}
          handleGoBack={handleGoBack}
          actionComponent={
            canAddMedication && (
              <Button onClick={() => setIsModalOpen(true)}>
                Adicionar Medicamento
              </Button>
            )
          }
        />
        <FormItem name='search' inputHeight='2.5rem'>
          <InputText
            className='w-100'
            placeholder='Buscar medicamento'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormItem>

        {content()}
      </section>
    </>
  )
}

export default Medications
