import {
  AttendanceRisk,
  PatientDisposition
} from '@/interfaces/IAttendance'
import { DoctorSpecializations } from '@/interfaces/IDoctor'
import { MedicationCategories } from '@/interfaces/IMedication'
import { NurseCorenType, NurseShifts } from '@/interfaces/INurse'
import { UserGender } from '@/interfaces/IUser'

/** Dados alinhados a docs/apresentacao/dados-roteiro-final.txt */
export const DEMO_PASSWORD = 'fastpass'

export const DEMO_UNIT_NAME = 'UPH 24h Zona Norte'

export type DemoLoginPersona = 'admin' | 'patient' | 'nurse' | 'doctor'

export const DEMO_LOGIN_PERSONAS: {
  value: DemoLoginPersona
  label: string
}[] = [
  { value: 'admin', label: 'Administrador' },
  { value: 'patient', label: 'Paciente' },
  { value: 'nurse', label: 'Enfermeiro' },
  { value: 'doctor', label: 'Medico' }
]

export const demoLogins: Record<
  DemoLoginPersona,
  { identifier: string; password: string }
> = {
  admin: {
    identifier: 'admin.jota@yopmail.com',
    password: DEMO_PASSWORD
  },
  patient: {
    identifier: 'patient.demo.banca@yopmail.com',
    password: DEMO_PASSWORD
  },
  nurse: {
    identifier: 'nurse.demo.banca@yopmail.com',
    password: DEMO_PASSWORD
  },
  doctor: {
    identifier: 'doctor.demo.banca@yopmail.com',
    password: DEMO_PASSWORD
  }
}

export const demoSignUp = {
  name: 'Paciente Demo Banca',
  cpf: '111.444.777-35',
  email: 'patient.demo.banca@yopmail.com',
  password: DEMO_PASSWORD
}

export const demoPreRegistration = {
  mainComplaint: 'Dor de garganta',
  painLevel: 10,
  selfMedicated: false,
  symptomLabels: ['Febre', 'Dor de garganta'],
  generalObservation: 'Pre-atendimento para demonstracao MedIT',
  symptomStartDaysAgo: 2
}

export const demoDoctorCreate = {
  name: 'Dr. Demo Banca',
  cpf: '457.924.950-09',
  birthDate: '15/03/1985',
  gender: UserGender.MALE,
  email: 'doctor.demo.banca@yopmail.com',
  password: DEMO_PASSWORD,
  cellphone: '(15) 99100-0001',
  workLocationLabel: 'Consultorio Demo 1',
  crm: '123456',
  specialization: DoctorSpecializations.EMERGENCY_MEDICINE
}

export const demoDoctorEdit = {
  cellphone: '(15) 99100-0099'
}

export const demoNurseCreate = {
  name: 'Enf. Demo Banca',
  cpf: '390.533.447-05',
  birthDate: '20/07/1992',
  gender: UserGender.FEMALE,
  email: 'nurse.demo.banca@yopmail.com',
  password: DEMO_PASSWORD,
  cellphone: '(15) 99200-0002',
  corenUf: 'SP',
  coren: '654321',
  corenType: NurseCorenType.ENF,
  shift: NurseShifts.MORNING,
  workLocationLabel: 'Sala triagem Demo 1'
}

export const demoNurseEdit = {
  cellphone: '(15) 99200-0099'
}

export const demoPatientEdit = {
  conditions: 'Hipertensao controlada'
}

export const demoMedicationCreate = {
  name: 'Medicamento Demo Banca',
  category: MedicationCategories.ANALGESICS,
  description: 'Item cadastrado ao vivo na apresentacao TCC MedIT',
  stockQuantity: 50,
  requiresPrescription: false
}

export const demoMedicationEdit = {
  stockQuantity: 45
}

export const demoAdminConfig = {
  cellphone: '(15) 99300-0003'
}

export const demoTriage = {
  temperature: '38,2',
  bloodPressure: '130/85',
  heartRate: '92',
  oxygenSaturation: '97',
  painLevel: '10',
  risk: AttendanceRisk.EMERGENCY,
  observation:
    'Paciente com febre e odinofagia; pre-atendimento remoto'
}

export const demoCompleteAttendance = {
  diagnosisText:
    'Quadro compativel com infeccao de vias aereas superiores',
  patientDisposition: PatientDisposition.HOME,
  /** Preferencia ao rotular diagnostico no catalogo */
  diagnosisLabelHints: ['Gripe', 'Influenza', 'Resfriado']
}
