import { api } from '@/api/api'
import { handleApiError } from '@/helpers/handleApiError'
import { useAuth } from '@/hooks/useAuth'
import type { IDoctor } from '@/interfaces/IDoctor'
import type { INurse } from '@/interfaces/INurse'
import type { IPatient } from '@/interfaces/IPatient'
import { ROUTES } from '@/routes/constants'
import { message, Modal } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../Button/Button'

interface IDeleteModalProps {
  user: IDoctor | INurse | IPatient | null
  label: string
  apiName: string
  buttonText?: string
}

function DeleteModal({ user, label, apiName, buttonText }: IDeleteModalProps) {
  const { logout } = useAuth()
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const idToDelete = user?._id || params.id
  const isDeleteUserLogged = label === 'usuário'

  const title = useMemo(() => {
    let actor

    if (isDeleteUserLogged) {
      actor = `seu ${label}`
    } else if (user?.name) {
      actor = user.name
    } else {
      actor = `este ${label}`
    }

    return `Deseja deletar ${actor}?`
  }, [isDeleteUserLogged, label, user])

  async function handleOpen() {
    const modal = Modal.confirm({
      title,
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim, deletar',
      cancelText: 'Cancelar',
      closable: true,
      mask: {
        closable: true
      },
      okButtonProps: {
        danger: true,
        autoFocus: true,
        size: 'middle'
      },
      cancelButtonProps: {
        size: 'middle'
      },
      async onOk() {
        modal.update({
          okButtonProps: {
            loading: true,
            danger: true
          }
        })

        try {
          await api.delete(`/${apiName}/${idToDelete}`)
          message.success(
            `${label.charAt(0).toUpperCase() + label.slice(1)} deletado com sucesso!`
          )

          if (isDeleteUserLogged) {
            logout()
          } else {
            const routeKey = apiName.toUpperCase() as keyof typeof ROUTES
            navigate(ROUTES[routeKey].path)
          }
        } catch (err) {
          handleApiError({ err, defaultMessage: `Erro ao deletar ${label}` })
        } finally {
          modal.update({
            okButtonProps: {
              loading: false,
              danger: true
            }
          })
        }
      }
    })
  }

  return <Button onClick={handleOpen}>{buttonText || 'Continuar'}</Button>
}

export default DeleteModal
