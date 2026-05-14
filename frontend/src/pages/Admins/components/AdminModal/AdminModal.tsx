import Button from '@/components/Button/Button'
import {
    FormItem,
    InputSelect,
    InputText
} from '@/components/FormComponents/FormComponents'
import { handleApiError } from '@/helpers/handleApiError'
import type { IUnit } from '@/interfaces/IUnit'
import type { IBaseUser } from '@/interfaces/IUser'
import UserRepository from '@/repositories/UserRepository'
import masks from '@/utils/masks'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useState } from 'react'
import formStyles from '../../../../components/FormComponents/FormComponents.module.scss'

type AdminLike = Pick<IBaseUser, 'name' | 'cpf' | 'email'> & {
  _id?: string
  unitId?: string
}

interface Props {
  admin: AdminLike | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
  units: IUnit[]
}

function AdminModal({ admin, isOpen, onClose, onSaved, units }: Props) {
  const [form] = useForm()
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(admin?._id)

  const unitOptions = units.map((unit) => ({
    value: String(unit._id),
    label: unit.name
  }))

  const handleClose = () => {
    onClose()
    form.resetFields()
    setFieldErrors({})
  }

  async function onFinish(values: Record<string, unknown>) {
    try {
      setLoading(true)
      setFieldErrors({})

      if (isEdit && admin?._id) {
        const body: Record<string, unknown> = {
          name: values.name,
          cpf: masks(String(values.cpf), 'cpf'),
          email: values.email,
          unitId: values.unitId
        }
        if (values.currentPassword && values.newPassword) {
          body.currentPassword = values.currentPassword
          body.newPassword = values.newPassword
        }
        await UserRepository.editAdmin({ adminId: admin._id, body })
      } else {
        await UserRepository.createAdmin({
          body: {
            name: values.name,
            cpf: masks(String(values.cpf), 'cpf'),
            email: values.email,
            password: values.password,
            unitId: values.unitId
          }
        })
      }

      message.success(
        isEdit
          ? 'Administrador atualizado com sucesso'
          : 'Administrador criado com sucesso'
      )
      onSaved()
      handleClose()
    } catch (err) {
      handleApiError({
        err,
        defaultMessage: 'Erro ao salvar administrador',
        setFieldErrors: (errors) => {
          setFieldErrors(
            Object.fromEntries(
              Object.entries(errors).map(([key, v]) => [key, v.message])
            )
          )
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && admin) {
      form.setFieldsValue({
        name: admin.name,
        cpf: admin.cpf ? masks(admin.cpf, 'cpf') : '',
        email: admin.email,
        unitId: admin.unitId ? String(admin.unitId) : undefined
      })
    } else if (isOpen && !admin) {
      form.resetFields()
    }
  }, [isOpen, admin, form])

  return (
    <Modal
      title={isEdit ? 'Editar administrador' : 'Novo administrador'}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        className={formStyles.form}
        layout='vertical'
        onFinish={onFinish}
      >
        <FormItem
          label='Nome'
          name='name'
          validateStatus={fieldErrors.name ? 'error' : undefined}
          help={fieldErrors.name}
          rules={[{ required: true, message: 'Informe o nome' }]}
        >
          <InputText />
        </FormItem>
        <FormItem
          label='CPF'
          name='cpf'
          validateStatus={fieldErrors.cpf ? 'error' : undefined}
          help={fieldErrors.cpf}
          rules={[{ required: true, message: 'Informe o CPF' }]}
        >
          <InputText />
        </FormItem>
        <FormItem
          label='E-mail'
          name='email'
          validateStatus={fieldErrors.email ? 'error' : undefined}
          help={fieldErrors.email}
          rules={[{ required: true, message: 'Informe o e-mail' }]}
        >
          <InputText type='email' />
        </FormItem>
        <FormItem
          label='Unidade'
          name='unitId'
          validateStatus={fieldErrors.unitId ? 'error' : undefined}
          help={fieldErrors.unitId}
          rules={[{ required: true, message: 'Selecione a unidade' }]}
        >
          <InputSelect allowClear={false} options={unitOptions} />
        </FormItem>
        {!isEdit && (
          <FormItem
            label='Senha'
            name='password'
            validateStatus={fieldErrors.password ? 'error' : undefined}
            help={fieldErrors.password}
            rules={[{ required: true, message: 'Informe a senha' }]}
          >
            <Input.Password />
          </FormItem>
        )}
        {isEdit && (
          <>
            <FormItem
              label='Senha atual'
              name='currentPassword'
              validateStatus={fieldErrors.currentPassword ? 'error' : undefined}
              help={fieldErrors.currentPassword}
            >
              <Input.Password />
            </FormItem>
            <FormItem
              label='Nova senha'
              name='newPassword'
              validateStatus={fieldErrors.newPassword ? 'error' : undefined}
              help={fieldErrors.newPassword}
            >
              <Input.Password />
            </FormItem>
          </>
        )}

        <Button htmlType='submit' loading={loading} className='w-100'>
          Salvar
        </Button>
      </Form>
    </Modal>
  )
}

export default AdminModal
