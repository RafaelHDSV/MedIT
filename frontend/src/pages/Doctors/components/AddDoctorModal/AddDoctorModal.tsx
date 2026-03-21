import Button from '@/components/Button/Button'
import { FormItem } from '@/components/FormComponents/FormComponents'
import formStyles from '@/styles/Form.module.scss'
import { Form, Input, Modal } from 'antd'
import { useState } from 'react'
import styles from './AddDoctorModal.module.scss'

function AddDoctorModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpen = () => setIsModalOpen(true)
  const handleClose = () => setIsModalOpen(false)
  const inputHeight = '2rem'

  function onFinish() {
    console.log('criar')
  }

  return (
    <>
      <Modal open={isModalOpen} onCancel={handleClose} footer={null} centered>
        <h2>Adicionar médico</h2>

        <Form className={formStyles.form} layout='vertical' onFinish={onFinish}>
          <div className={styles.formInputs}>
            <FormItem
              label='Nome completo'
              name='name'
              inputHeight={inputHeight}
            >
              <Input />
            </FormItem>

            <FormItem label='CPF' name='cpf' inputHeight={inputHeight}>
              <Input />
            </FormItem>

            <FormItem
              label='Data de nascimento'
              name='birthDate'
              inputHeight={inputHeight}
            >
              <Input type='date' />
            </FormItem>

            <FormItem label='Gênero' name='gender' inputHeight={inputHeight}>
              <Input />
            </FormItem>

            <FormItem label='Email' name='email' inputHeight={inputHeight}>
              <Input />
            </FormItem>

            <FormItem label='Senha' name='password' inputHeight={inputHeight}>
              <Input.Password />
            </FormItem>

            <FormItem label='Telefone' name='phone' inputHeight={inputHeight}>
              <Input />
            </FormItem>

            <FormItem label='CRM' name='crm' inputHeight={inputHeight}>
              <Input />
            </FormItem>

            <FormItem
              label='Especialidade'
              name='specialty'
              inputHeight={inputHeight}
            >
              <Input />
            </FormItem>
          </div>

          <FormItem>
            <Button htmlType='submit'>Adicionar médico</Button>
          </FormItem>
        </Form>
      </Modal>

      <Button onClick={handleOpen}>Adicionar médico</Button>
    </>
  )
}

export default AddDoctorModal
