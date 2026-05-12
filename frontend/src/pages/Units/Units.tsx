import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import listTableStyles from '@/components/ListTable/ListTable.module.scss'
import ReloadButton from '@/components/ReloadButton/ReloadButton'
import Tag from '@/components/Tag/Tag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IUnit } from '@/interfaces/IUnit'
import { UserLevels } from '@/interfaces/IUser'
import UnitsRepository from '@/repositories/UnitsRepository'
import { ROUTES } from '@/routes/constants'
import getFullAddress from '@/utils/getFullAddress'
import { Input, Select, Skeleton } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UnitsModal from './components/UnitsModal/UnitsModal'
import styles from './Units.module.scss'
import { getUnitStatus } from './unitsFunctions'

const UNIT_FILTER_OPTIONS = [
  { label: 'Nome', value: 'name' },
  { label: 'Endereço', value: 'address' },
  { label: 'Status', value: 'status' }
]

const UNIT_STATUS_FILTER_OPTIONS = [
  { label: 'Aberto', value: 'Aberto' },
  { label: 'Fechado', value: 'Fechado' },
  { label: 'Fechando', value: 'Fechando' }
]

function Units() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [units, setUnits] = useState<IUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'name' | 'address' | 'status'>(
    'name'
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const activeUnitId = user?.unitId

  const isMedit = user?.level === UserLevels.MEDIT

  const fetchUnits = useCallback(async () => {
    setLoading(true)
    try {
      const response = isMedit
        ? await UnitsRepository.getAllUnits()
        : await UnitsRepository.getUnits({ activeUnitId })

      const formatResponse = response?.data?.map((unit: IUnit) => ({
        fullAddress: getFullAddress(unit.address),
        ...unit
      }))

      setUnits(formatResponse ?? [])
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao buscar unidades' })
    } finally {
      setLoading(false)
    }
  }, [activeUnitId, isMedit])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  const filteredUnits = useMemo(() => {
    if (!searchTerm) return units

    return units.filter((unit) => {
      switch (filterBy) {
        case 'name': {
          const search = searchTerm.toLowerCase()
          return unit.name.toLowerCase().includes(search)
        }
        case 'address': {
          const search = searchTerm.toLowerCase()
          return unit.fullAddress?.toLowerCase().includes(search)
        }
        case 'status':
          return getUnitStatus(unit).text === searchTerm
        default:
          return true
      }
    })
  }, [searchTerm, filterBy, units])

  const searchPlaceholder = useMemo(() => {
    switch (filterBy) {
      case 'address':
        return 'Buscar por endereço'
      default:
        return 'Buscar por nome'
    }
  }, [filterBy])

  function handleResetFilter() {
    setFilterBy('name')
    setSearchTerm('')
    fetchUnits()
  }

  function handleToMedications(unitId: string) {
    navigate(ROUTES.MEDICAMENTS.path.replace(':unitId', unitId))
  }

  return (
    <>
      <UnitsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchUnits={fetchUnits}
      />

      <section>
        <AuthLayoutHeader
          actionComponent={
            isMedit && (
              <Button onClick={() => setIsModalOpen(true)}>
                Adicionar Unidade
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
              options={UNIT_FILTER_OPTIONS}
              onChange={(value) => {
                setFilterBy(value)
                setSearchTerm('')
              }}
            />
            {filterBy === 'status' ? (
              <Select
                className={listTableStyles.searchInput}
                rootClassName={listTableStyles.filterSelectDropdown}
                allowClear
                placeholder='Filtrar por status da unidade'
                options={UNIT_STATUS_FILTER_OPTIONS}
                value={searchTerm || undefined}
                onChange={(value) => setSearchTerm(value ?? '')}
              />
            ) : (
              <Input
                className={listTableStyles.searchInput}
                placeholder={searchPlaceholder}
                allowClear
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            )}
          </div>

          <ReloadButton onReload={handleResetFilter} />
        </div>

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 9 }).map((_item, index) => (
                <Skeleton.Button key={index} className={styles.skeleton} />
              ))
            : filteredUnits?.map((unit) => {
                const statusInfo = getUnitStatus(unit)
                const isActive = activeUnitId === unit._id

                return (
                  <div
                    key={String(unit._id)}
                    className={`${styles.card} ${isActive ? styles.isActive : ''}`}
                    onClick={() => {
                      if (!isMedit) handleToMedications(String(unit._id))
                    }}
                    style={{ cursor: isMedit ? 'default' : 'pointer' }}
                  >
                    <div className={styles.cardHeader}>
                      <h3>{unit.name}</h3>
                      <Tag status={statusInfo.status}>{statusInfo.text}</Tag>
                    </div>

                    <p className={styles.address}>{unit.fullAddress}</p>
                  </div>
                )
              })}
        </div>
      </section>
    </>
  )
}

export default Units
