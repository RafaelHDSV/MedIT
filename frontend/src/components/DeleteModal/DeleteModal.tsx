import { api } from '@/api/api'
import type { IDoctor } from '@/interfaces/IDoctor'
import type { INurse } from '@/interfaces/INurse'
import type { IPatient } from '@/interfaces/IPatient'
import { ROUTES } from '@/routes/constants'
import { message, Modal } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../Button/Button'

interface IDeleteModalProps {
  user: IDoctor | INurse | IPatient | null
  label: string
  apiName: string
  buttonText?: string
}

function DeleteModal({ user, label, apiName, buttonText }: IDeleteModalProps) {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  async function handleOpen() {
    const modal = Modal.confirm({
      title: `Deseja deletar o ${user?.name ?? label}?`,
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
          await api.delete(`/${apiName}/${params.id}`)

          navigate(ROUTES[apiName.toUpperCase() as keyof typeof ROUTES].path)
          message.success(
            `${label.charAt(0).toUpperCase() + label.slice(1)} deletado com sucesso!`
          )
        } catch (err) {
          console.error(`Erro ao deletar ${label}`, err)
          message.error(`Erro ao deletar ${label}`)
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
