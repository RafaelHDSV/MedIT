import { api } from '@/api/api'
import { ROUTES } from '@/routes/constants'
import { message, Modal } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../Button/Button'

interface IDeleteModalProps {
  buttonText?: string
}

function DeleteModal({ buttonText }: IDeleteModalProps) {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  async function handleOpen() {
    const modal = Modal.confirm({
      title: 'Deseja deletar esse médico?',
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
          await api.delete(`/doctors/${params.id}`)

          navigate(ROUTES.DOCTORS.path)
          message.success('Médico deletado com sucesso!')
        } catch (err) {
          console.error('Erro ao deletar médico', err)
          message.error('Erro ao deletar médico')
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
