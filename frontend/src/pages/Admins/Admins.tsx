import AuthLayoutHeader from '@/components/AuthLayoutHeader/AuthLayoutHeader'
import Button from '@/components/Button/Button'
import ListTable from '@/components/ListTable/ListTable'
import { handleApiError } from '@/helpers/handleApiError'
import type { IUnit } from '@/interfaces/IUnit'
import type { IBaseUser } from '@/interfaces/IUser'
import UnitsRepository from '@/repositories/UnitsRepository'
import UserRepository from '@/repositories/UserRepository'
import MeditOnlyRoute from '@/routes/MeditOnlyRoute'
import { Flex } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from '../../components/ListTable/ListTable.module.scss'
import AdminModal from './components/AdminModal/AdminModal'
import { useAdminColumns } from './hooks/useAdminColumns'

type AdminRow = IBaseUser & { _id: string; unitId?: string }

function AdminsPage() {
  const [units, setUnits] = useState<IUnit[]>([])
  const [rows, setRows] = useState<AdminRow[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminRow | null>(null)

  const unitNameById = useMemo(() => {
    const unitMap = new Map<string, string>()
    units.forEach((u) => unitMap.set(String(u._id), u.name))
    return unitMap
  }, [units])

  const fetchUnits = useCallback(async () => {
    try {
      const response = await UnitsRepository.getAllUnits()
      setUnits(response.data ?? [])
    } catch (err) {
      handleApiError({ err, defaultMessage: 'Erro ao carregar unidades' })
    }
  }, [])

  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const response = await UserRepository.getAdmins({
        unitId: undefined,
        search: undefined
      })
      setRows((response.data ?? []) as AdminRow[])
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao carregar administradores'
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const columns = useAdminColumns({
    setEditingAdmin: setEditing,
    setEditModalOpen: setModalOpen,
    fetchAdmins,
    unitNameById
  })

  return (
    <MeditOnlyRoute>
      <section>
        <AdminModal
          admin={editing}
          isOpen={modalOpen}
          units={units}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            fetchAdmins()
          }}
        />

        <div className={styles.tableContent}>
          <Flex vertical className={styles.container}>
            <AuthLayoutHeader
              actionComponent={
                <Button
                  onClick={() => {
                    setEditing(null)
                    setModalOpen(true)
                  }}
                >
                  Novo administrador
                </Button>
              }
            />

            <ListTable<AdminRow>
              dataSource={rows}
              columns={columns}
              loading={loading}
              onReload={fetchAdmins}
            />
          </Flex>
        </div>
      </section>
    </MeditOnlyRoute>
  )
}

export default AdminsPage
