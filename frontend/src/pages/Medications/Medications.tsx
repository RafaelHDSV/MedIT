import Alert from '@/components/Alert/Alert'
import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import Empty from '@/components/Empty/Empty'
import { LayoutSpinner } from '@/components/LayoutSpinner/LayoutSpinner'
import listTableStyles from '@/components/ListTable/ListTable.module.scss'
import ReloadButton from '@/components/ReloadButton/ReloadButton'
import Tag from '@/components/Tag/Tag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IMedication } from '@/interfaces/IMedication'
import {
  MedicationAvailabilityStatus,
  MedicationAvailabilityStatusLabels,
  MedicationCategories,
  MedicationCategoriesLabels
} from '@/interfaces/IMedication'
import type { IUnit } from '@/interfaces/IUnit'
import MedicationModel from '@/models/MedicationModel'
import MedicationsRepository from '@/repositories/MedicationsRepository'
import UnitsRepository from '@/repositories/UnitsRepository'
import { ROUTES } from '@/routes/constants'
import getFullAddress from '@/utils/getFullAddress'
import masks from '@/utils/masks'
import { Input, Select, message } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from './Medications.module.scss'
import EditMedicationModal from './components/EditMedicationModal/EditMedicationModal'
import MedicationDetailsModal from './components/MedicationDetailsModal/MedicationDetailsModal'
import MedicationModal from './components/MedicationModal/MedicationModal'
import { MEDICATIONS_STATUS_MAP } from './medicationsConstants'

const FILTER_OPTIONS = [
  { label: 'Nome', value: 'name' },
  { label: 'Categoria', value: 'category' },
  { label: 'Status', value: 'status' }
]

const MEDICATION_CATEGORY_FILTER_OPTIONS = (
  Object.values(MedicationCategories) as Array<
    (typeof MedicationCategories)[keyof typeof MedicationCategories]
  >
).map((value) => ({
  value,
  label: MedicationCategoriesLabels[value]
}))

const MEDICATION_STATUS_FILTER_OPTIONS = (
  Object.values(MedicationAvailabilityStatus) as Array<
    (typeof MedicationAvailabilityStatus)[keyof typeof MedicationAvailabilityStatus]
  >
).map((value) => ({
  value,
  label: MedicationAvailabilityStatusLabels[value]
}))

function Medications() {
  const { user } = useAuth()
  const { unitId } = useParams()
  const navigate = useNavigate()

  const [unit, setUnit] = useState<IUnit | undefined>()
  const [medications, setMedications] = useState<IMedication[]>([])
  const [unitsLoading, setUnitsLoading] = useState(true)
  const [medicationsLoading, setMedicationsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'name' | 'category' | 'status'>(
    'name'
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<
    IMedication | undefined
  >()
  const [editingMedication, setEditingMedication] = useState<
    IMedication | undefined
  >()

  const loading = unitsLoading || medicationsLoading
  const canAddMedication = MedicationModel.canAddMedication(user?.level)
  const canSeeUnits = MedicationModel.canSeeUnits(user?.level)
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
    if (!searchTerm) return medications

    return medications.filter((medication) => {
      switch (filterBy) {
        case 'name': {
          const search = searchTerm.toLowerCase()
          return medication.name.toLowerCase().includes(search)
        }
        case 'category':
          return medication.category === searchTerm
        case 'status':
          return medication.availabilityStatus === searchTerm
        default:
          return true
      }
    })
  }, [searchTerm, filterBy, medications])

  function handleResetFilter() {
    setFilterBy('name')
    setSearchTerm('')
    fetchMedications()
  }

  function handleGoBack() {
    navigate(ROUTES.PARTNERS_UNITS.path)
  }

  function handleEditMedication(medication: IMedication) {
    if (String(user?.unitId) !== String(medication.unitId)) {
      message.warning('Você só pode editar medicamentos da sua unidade.')
      return
    }

    setEditingMedication(medication)
    setSelectedMedication(undefined)
    setIsEditModalOpen(true)
  }

  function content() {
    if (loading) return <LayoutSpinner />
    if (!medications || medications.length === 0) return <Empty />

    return (
      <div className={styles.grid}>
        {filteredMedications?.map((medication) => (
          <div
            key={String(medication._id)}
            className={styles.card}
            onClick={() => setSelectedMedication(medication)}
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

              {canSeeUnits && (
                <span className={styles.quantity}>
                  {medication.stockQuantity === 0
                    ? 'Sem medicamentos'
                    : `${masks(medication.stockQuantity, 'number')} un.`}
                </span>
              )}
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
        onEditMedication={handleEditMedication}
      />

      <EditMedicationModal
        medication={editingMedication}
        isModalOpen={isEditModalOpen}
        setIsModalOpen={(value) => {
          setIsEditModalOpen(value)
          if (!value) setEditingMedication(undefined)
        }}
        fetchMedications={fetchMedications}
      />

      <section>
        <Alert
          message={
            <>
              Clique na seta de voltar ao lado do título ou{' '}
              <Link to={ROUTES.PARTNERS_UNITS.path}>aqui</Link> para ver
              unidades parceiras e encontrar o medicamento desejado em outras
              unidades
            </>
          }
        />

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

        <div className={listTableStyles.filters}>
          <div className={listTableStyles.filtersGroup}>
            <Select
              className={listTableStyles.filterSelect}
              rootClassName={listTableStyles.filterSelectDropdown}
              value={filterBy}
              options={FILTER_OPTIONS}
              onChange={(value) => {
                setFilterBy(value)
                setSearchTerm('')
              }}
            />

            {filterBy === 'name' ? (
              <Input
                className={listTableStyles.searchInput}
                placeholder='Buscar por nome do medicamento'
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            ) : filterBy === 'category' ? (
              <Select
                className={listTableStyles.searchInput}
                rootClassName={listTableStyles.filterSelectDropdown}
                allowClear
                placeholder='Filtrar por categoria'
                options={MEDICATION_CATEGORY_FILTER_OPTIONS}
                value={searchTerm || undefined}
                onChange={(value) => setSearchTerm(value ?? '')}
              />
            ) : (
              <Select
                className={listTableStyles.searchInput}
                rootClassName={listTableStyles.filterSelectDropdown}
                allowClear
                placeholder='Filtrar por status de disponibilidade'
                options={MEDICATION_STATUS_FILTER_OPTIONS}
                value={searchTerm || undefined}
                onChange={(value) => setSearchTerm(value ?? '')}
              />
            )}
          </div>

          <ReloadButton onReload={handleResetFilter} />
        </div>

        {content()}
      </section>
    </>
  )
}

export default Medications
