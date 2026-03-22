import Button from '@/components/Button/Button'
import { FormItem } from '@/components/FormComponents/FormComponents'
import InputText from '@/components/InputText/InputText'
import {
  DoctorSpecializations,
  DoctorSpecializationsLabels,
  type DoctorFormValues
} from '@/interfaces/IDoctor'
import { UserGendersLabels } from '@/interfaces/IUser'
import formStyles from '@/styles/Form.module.scss'
import validators, { birthDateValidator } from '@/utils/validators'
import { Form, Input, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import styles from './AddDoctorModal.module.scss'

function AddDoctorModal() {
  const [form] = useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const handleOpen = () => setIsModalOpen(true)
  const handleClose = () => {
    setIsModalOpen(false)
    form.resetFields()
  }
  const inputHeight = '2rem'
  const specialization = Form.useWatch('specialization', form)

  function onFinish(values: DoctorFormValues) {
    console.log('Criar médico', values)
  }

  return (
    <>
      <Modal
        className={styles.modal}
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <h2>Adicionar médico</h2>

        <Form
          form={form}
          className={`${formStyles.form} mt-1`}
          layout='vertical'
          onFinish={onFinish}
        >
          <div className={styles.formInputs}>
            <FormItem
              label='Nome completo'
              name='name'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu nome completo' }]}
            >
              <Input />
            </FormItem>

            <FormItem
              label='CPF'
              name='cpf'
              inputHeight={inputHeight}
              rules={[
                { required: true, message: 'Informe seu CPF' },
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve()
                    const error = validators(value, 'validCpf')
                    return error
                      ? Promise.resolve()
                      : Promise.reject(new Error('CPF inválido'))
                  }
                }
              ]}
            >
              <InputText mask='cpf' />
            </FormItem>

            <FormItem
              label='Data de nascimento'
              name='birthDate'
              inputHeight={inputHeight}
              rules={[
                { required: true, message: 'Informe sua data de nascimento' },
                {
                  validator(_, value) {
                    return birthDateValidator(value)
                  }
                }
              ]}
            >
              <InputText />
              {/* <InputDate /> */}
            </FormItem>

            <FormItem
              label='Gênero'
              name='gender'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu gênero' }]}
            >
              <Select
                options={Object.entries(UserGendersLabels).map(
                  ([key, value]) => ({
                    label: value,
                    value: key
                  })
                )}
              />
            </FormItem>

            <FormItem
              label='Email'
              name='email'
              inputHeight={inputHeight}
              rules={[
                { required: true, message: 'Informe seu email' },
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve()
                    const error = validators(value, 'email')
                    return error
                      ? Promise.resolve()
                      : Promise.reject(new Error('Email inválido'))
                  }
                }
              ]}
            >
              <Input />
            </FormItem>

            <FormItem
              label='Senha'
              name='password'
              inputHeight={inputHeight}
              rules={[
                { required: true, message: 'Informe sua senha' },
                { min: 6, message: 'Senha deve ter no mínimo 6 caracteres' }
              ]}
            >
              <Input.Password />
            </FormItem>

            <FormItem
              label='Telefone'
              name='cellphone'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu telefone' }]}
            >
              <InputText mask='cellphone' />
            </FormItem>

            <FormItem
              label='CRM'
              name='crm'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe seu CRM' }]}
            >
              <InputText mask='crm' maxLength={9} />
            </FormItem>

            <FormItem
              label='Especialidade'
              name='specialization'
              inputHeight={inputHeight}
              rules={[{ required: true, message: 'Informe sua especialidade' }]}
            >
              <Select
                options={Object.entries(DoctorSpecializationsLabels).map(
                  ([key, value]) => ({
                    label: value,
                    value: key
                  })
                )}
              />
            </FormItem>

            {specialization &&
              specialization === DoctorSpecializations.OTHER && (
                <FormItem
                  label='Especialidade não listada'
                  name='otherSpecialization'
                  inputHeight={inputHeight}
                  rules={[
                    { required: true, message: 'Informe sua especialidade' }
                  ]}
                >
                  <Input />
                </FormItem>
              )}
          </div>

          <footer className={styles.footer}>
            <FormItem>
              <Button htmlType='submit'>Adicionar médico</Button>
            </FormItem>
          </footer>
        </Form>
      </Modal>

      <Button onClick={handleOpen}>Adicionar médico</Button>
    </>
  )
}

export default AddDoctorModal
