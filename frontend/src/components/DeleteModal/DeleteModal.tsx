import { api } from '@/api/api'
import { ROUTES } from '@/routes/constants'
import { message, Modal } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '../Button/Button'

interface IDeleteModalProps {
  label: string
  apiName: string
  buttonText?: string
  overrideId?: string // Adicionado para suportar deleção de conta
}

function DeleteModal({
  label,
  apiName,
  buttonText,
  overrideId
}: IDeleteModalProps) {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Define se usa o ID vindo por prop (conta) ou pela URL (médicos/pacientes)
  const idToDelete = overrideId || params.id

  async function handleOpen() {
    const modal = Modal.confirm({
      title: `Deseja deletar ${label === 'conta' ? 'sua' : 'este'} ${label}?`,
      content: 'Esta ação não pode ser desfeita.',
      okText: 'Sim, deletar',
      cancelText: 'Cancelar',
      closable: true,
      mask: { closable: true },
      okButtonProps: {
        danger: true,
        autoFocus: true,
        size: 'middle'
      },
      cancelButtonProps: { size: 'middle' },
      async onOk() {
        modal.update({
          okButtonProps: { loading: true, danger: true }
        })

        try {
          await api.delete(`/${apiName}/${idToDelete}`)

          message.success(
            `${label.charAt(0).toUpperCase() + label.slice(1)} deletado com sucesso!`
          )

          if (label === 'conta') {
            // Limpa os dados de autenticação e redireciona para SIGNIN
            localStorage.clear()
            navigate(ROUTES.SIGNIN.path)
          } else {
            // Redireciona para a listagem do recurso (ex: DOCTORS)
            const routeKey = apiName.toUpperCase() as keyof typeof ROUTES
            navigate(ROUTES[routeKey].path)
          }
        } catch (err) {
          console.error(`Erro ao deletar ${label}`, err)
          message.error(`Erro ao deletar ${label}`)
        } finally {
          modal.update({
            okButtonProps: { loading: false, danger: true }
          })
        }
      }
    })
  }

  return <Button onClick={handleOpen}>{buttonText || 'Continuar'}</Button>
}

export default DeleteModal
