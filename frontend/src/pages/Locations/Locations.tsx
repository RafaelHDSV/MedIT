import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import { FormItem, InputText } from '@/components/FormComponents/FormComponents'
import Tag from '@/components/Tag/Tag'
import { handleApiError } from '@/helpers/handleApiError'
import type { ILocation } from '@/interfaces/ILocation'
import UnitsRepository from '@/repositories/UnitsRepository'
import { ROUTES } from '@/routes/constants'
import { Skeleton } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LocationsModal from './components/LocationsModal/LocationsModal'
import styles from './Locations.module.scss'
import { getLocationStatus } from './locationsFunctions'

function Locations() {
  const navigate = useNavigate()
  const [locations, setLocations] = useState<ILocation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  // VIEIRA: Verificar possibilidade de nível Medit
  const isMedit = false

  async function fetchLocations() {
    setLoading(true)

    try {
      const response = await UnitsRepository.getUnits()
      setLocations(response)
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao buscar localizações' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const filteredLocations = useMemo(() => {
    if (!searchTerm || searchTerm === '') return locations
    const search = searchTerm.toLowerCase()

    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(search) ||
        loc.address.toLowerCase().includes(search)
    )
  }, [searchTerm, locations])

  function handleToMedications(locationId: string) {
    navigate(ROUTES.MEDICAMENTS.path.replace(':unitId', locationId))
  }

  return (
    <>
      <LocationsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchLocations={fetchLocations}
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
            : filteredLocations?.map((location) => {
                const statusInfo = getLocationStatus(location)

                return (
                  <div
                    key={location._id}
                    className={styles.card}
                    onClick={() => handleToMedications(location._id)}
                  >
                    <div className={styles.cardHeader}>
                      <h3>{location.name}</h3>

                      <Tag status={statusInfo.status}>{statusInfo.text}</Tag>
                    </div>

                    <p className={styles.address}>{location.address}</p>
                  </div>
                )
              })}
        </div>
      </section>
    </>
  )
}

export default Locations
