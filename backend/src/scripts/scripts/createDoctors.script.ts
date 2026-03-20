import { Roles, UserGender } from '../../interfaces/IUser.js'
import UserModel from '../../models/UserModel.js'
import { Script } from '../types.js'

const newDoctors = [
  {
    name: 'João Pedro da Silva',
    cpf: '11111111101',
    email: 'doctor1@yopmail.com',
    password: 'fastpass',
    age: 45,
    gender: UserGender.MALE,
    cellphone: 11999990001,
    birthDate: new Date('1980-05-10'),
    crm: '100001',
    specialization: 'Cardiologia'
  },
  {
    name: 'Maria Fernanda Souza',
    cpf: '11111111102',
    email: 'doctor2@yopmail.com',
    password: 'fastpass',
    age: 38,
    gender: UserGender.FEMALE,
    cellphone: 11999990002,
    birthDate: new Date('1987-08-20'),
    crm: '100002',
    specialization: 'Dermatologia'
  },
  {
    name: 'Carlos Eduardo Lima',
    cpf: '11111111103',
    email: 'doctor3@yopmail.com',
    password: 'fastpass',
    age: 50,
    gender: UserGender.MALE,
    cellphone: 11999990003,
    birthDate: new Date('1975-02-15'),
    crm: '100003',
    specialization: 'Ortopedia'
  },
  {
    name: 'Ana Beatriz Costa',
    cpf: '11111111104',
    email: 'doctor4@yopmail.com',
    password: 'fastpass',
    age: 42,
    gender: UserGender.FEMALE,
    cellphone: 11999990004,
    birthDate: new Date('1983-11-01'),
    crm: '100004',
    specialization: 'Pediatria'
  },
  {
    name: 'Ricardo Alves Pereira',
    cpf: '11111111105',
    email: 'doctor5@yopmail.com',
    password: 'fastpass',
    age: 55,
    gender: UserGender.MALE,
    cellphone: 11999990005,
    birthDate: new Date('1970-07-30'),
    crm: '100005',
    specialization: 'Neurologia'
  },
  {
    name: 'Juliana Martins Rocha',
    cpf: '11111111106',
    email: 'doctor6@yopmail.com',
    password: 'fastpass',
    age: 36,
    gender: UserGender.FEMALE,
    cellphone: 11999990006,
    birthDate: new Date('1989-03-12'),
    crm: '100006',
    specialization: 'Ginecologia'
  },
  {
    name: 'Fernando Gomes Ribeiro',
    cpf: '11111111107',
    email: 'doctor7@yopmail.com',
    password: 'fastpass',
    age: 48,
    gender: UserGender.MALE,
    cellphone: 11999990007,
    birthDate: new Date('1977-06-18'),
    crm: '100007',
    specialization: 'Oftalmologia'
  },
  {
    name: 'Patrícia Nunes Carvalho',
    cpf: '11111111108',
    email: 'doctor8@yopmail.com',
    password: 'fastpass',
    age: 41,
    gender: UserGender.FEMALE,
    cellphone: 11999990008,
    birthDate: new Date('1984-09-25'),
    crm: '100008',
    specialization: 'Endocrinologia'
  },
  {
    name: 'Bruno Henrique Teixeira',
    cpf: '11111111109',
    email: 'doctor9@yopmail.com',
    password: 'fastpass',
    age: 39,
    gender: UserGender.MALE,
    cellphone: 11999990009,
    birthDate: new Date('1986-01-05'),
    crm: '100009',
    specialization: 'Psiquiatria'
  },
  {
    name: 'Camila Rodrigues Mendes',
    cpf: '11111111110',
    email: 'doctor10@yopmail.com',
    password: 'fastpass',
    age: 34,
    gender: UserGender.FEMALE,
    cellphone: 11999990010,
    birthDate: new Date('1991-12-14'),
    crm: '100010',
    specialization: 'Clínico Geral'
  }
]

const createDoctors: Script = {
  name: 'create-doctors',
  description: 'Cria 10 médicos para testes',
  async run() {
    console.log('👨‍⚕️ Criando 10 médicos...')

    for (const doctor of newDoctors) {
      const exists = await UserModel.findOne({
        $or: [{ email: doctor.email }, { cpf: doctor.cpf }]
      })

      if (exists) {
        console.log(`⚠️ Já existe: ${doctor.email}`)
        continue
      }

      await UserModel.create({
        ...doctor,
        role: Roles.DOCTOR
      })

      console.log(`✅ Criado: ${doctor.email}`)
    }

    console.log('🎉 Finalizado!')
  }
}

export default createDoctors
