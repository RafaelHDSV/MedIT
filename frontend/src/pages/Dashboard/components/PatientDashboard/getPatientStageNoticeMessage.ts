import {
  AttendanceStatus,
  PatientFlowNoticeKind,
  type IAttendance
} from '@/interfaces/IAttendance'

export function getPatientStageNoticeMessage(
  attendance: Partial<IAttendance> | null | undefined
): string | null {
  if (!attendance?.status || !attendance.patientFlowNotices?.length) return null

  const notices = attendance.patientFlowNotices

  if (attendance.status === AttendanceStatus.IN_TRIAGE) {
    const triage = notices.filter(
      (n) => n.kind === PatientFlowNoticeKind.TRIAGE_START
    )
    const last = triage[triage.length - 1]
    if (!last) return null
    const loc = last.locationLabel?.trim()
    if (loc) {
      return `Sua triagem foi iniciada. Dirija-se a: ${loc}.`
    }
    return 'Sua triagem foi iniciada. Dirija-se ao local de triagem indicado pela unidade.'
  }

  if (attendance.status === AttendanceStatus.IN_ATTENDANCE) {
    const consult = notices.filter(
      (n) => n.kind === PatientFlowNoticeKind.CONSULT_START
    )
    const last = consult[consult.length - 1]
    if (!last) return null
    const loc = last.locationLabel?.trim()
    if (loc) {
      return `Sua consulta foi iniciada. Dirija-se a: ${loc}.`
    }
    return 'Sua consulta foi iniciada. Dirija-se ao consultório indicado pela unidade.'
  }

  return null
}
