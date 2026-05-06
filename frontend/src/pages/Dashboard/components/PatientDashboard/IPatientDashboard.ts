import type { AttendanceRisk, AttendanceStatus, IAttendance } from '@/interfaces/IAttendance'

// ─── Fila de atendimento da unidade ────────────────────────────────────────────
export interface IPatientQueueItem {
  _id: string
  number?: number
  patientName: string
  status: AttendanceStatus
  risk: AttendanceRisk
  /** true quando este item corresponde ao paciente logado */
  isCurrentUser?: boolean
}

// ─── Dados da consulta atual (active attendance) ───────────────────────────────
export type IActiveAttendance = Pick<
  IAttendance,
  | '_id'
  | 'complaint'
  | 'painLevel'
  | 'selfMedicated'
  | 'symptomStartDate'
  | 'symptoms'
  | 'status'
  | 'date'
  | 'risk'
>

// ─── Dados do último atendimento concluído ─────────────────────────────────────
export interface ILastAttendance {
  _id: string
  date: Date | string
  doctorName?: string
  unitName?: string
  /** Código CID (diagnosisKey) — exibir em vez do nome popular */
  diagnosisKey?: string
  medicationNames?: string[]
  generalObservation?: string
  prescribedMedications?: { name: string; dosage?: string }[]
}

// ─── Status seguinte no fluxo de atendimento ──────────────────────────────────
import { AttendanceStatus as AS } from '@/interfaces/IAttendance'

export const nextStatusMap: Partial<Record<AttendanceStatus, AttendanceStatus>> = {
  [AS.ON_THE_WAY]: AS.WAITING_TRIAGE,
  [AS.WAITING_TRIAGE]: AS.IN_TRIAGE,
  [AS.IN_TRIAGE]: AS.WAITING_ATTENDANCE,
  [AS.TRIAGE_COMPLETED]: AS.WAITING_ATTENDANCE,
  [AS.WAITING_ATTENDANCE]: AS.IN_ATTENDANCE,
  [AS.IN_ATTENDANCE]: AS.ATTENDANCE_COMPLETED
}
