import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { FormItem, InputText } from '@/components/FormComponents/FormComponents'
import Tag from '@/components/Tag/Tag'
import { handleApiError } from '@/helpers/handleApiError'
import type { IUnit } from '@/interfaces/IUnit'
import UnitsRepository from '@/repositories/UnitsRepository'
import { ROUTES } from '@/routes/constants'
import { Skeleton } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UnitsModal from './components/UnitsModal/UnitsModal'
import styles from './Units.module.scss'
import { getUnitStatus } from './unitsFunctions'

function Units() {
  const navigate = useNavigate()
  const [units, setUnits] = useState<IUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  // VIEIRA: Verificar possibilidade de nível Medit
  const isMedit = false

  async function fetchUnits() {
    setLoading(true)

    try {
      const response = await UnitsRepository.getUnits()

      const formatResponse = response.map((unit: IUnit) => {
        const { street, number, neighborhood, city, state, zipCode } =
          unit.address

        return {
          fullAddress: `${street ?? '-'}, ${number ?? '-'} - ${neighborhood ?? '-'}, ${city ?? '-'} - ${state ?? '-'}, ${zipCode ?? '-'}`,
          ...unit
        }
      })

      setUnits(formatResponse)
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao buscar unidades' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  const filteredUnits = useMemo(() => {
    if (!searchTerm || searchTerm === '') return units
    const search = searchTerm.toLowerCase()

    return units.filter(
      (loc) =>
        loc.name.toLowerCase().includes(search) ||
        loc.fullAddress?.toLowerCase().includes(search)
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

                return (
                  <div
                    key={String(unit._id)}
                    className={styles.card}
                    onClick={() => handleToMedications(String(unit._id))}
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
