import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { FormItem, InputText } from '@/components/FormComponents/FormComponents'
import Tag from '@/components/Tag/Tag'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IUnit } from '@/interfaces/IUnit'
import { UserLevels } from '@/interfaces/IUser'
import UnitsRepository from '@/repositories/UnitsRepository'
import { ROUTES } from '@/routes/constants'
import getFullAddress from '@/utils/getFullAddress'
import { Skeleton } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UnitsModal from './components/UnitsModal/UnitsModal'
import styles from './Units.module.scss'
import { getUnitStatus } from './unitsFunctions'

function Units() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [units, setUnits] = useState<IUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const activeUnitId = user?.unitId

  const isMedit = user?.level === UserLevels.MEDIT

  const fetchUnits = useCallback(async () => {
    setLoading(true)

    try {
      const response = isMedit
        ? await UnitsRepository.getAllUnits()
        : await UnitsRepository.getUnits({ activeUnitId })

      const formatResponse = response?.data?.map((unit: IUnit) => {
        return {
          fullAddress: getFullAddress(unit.address),
          ...unit
        }
      })

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
    if (!searchTerm || searchTerm === '') return units
    const search = searchTerm.toLowerCase()

    return units.filter(
      (unit) =>
        unit.name.toLowerCase().includes(search) ||
        unit.fullAddress?.toLowerCase().includes(search)
    )
  }, [searchTerm, units])

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

        {/* VIEIRA: Adicionar filtros igual médico */}
        <FormItem name='search' inputHeight='2.5rem'>
          <InputText
            className='w-100'
            placeholder='Buscar localização'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormItem>

        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 9 })?.map((_item, index) => {
                return (
                  <Skeleton.Button key={index} className={styles.skeleton} />
                )
              })
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
