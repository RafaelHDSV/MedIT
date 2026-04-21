import { AttendanceRisk } from '@/interfaces/IAttendance'

interface IRiskColors {
  color: string
  bgColor: string
}

export const riskColors: Record<AttendanceRisk, IRiskColors> = {
  [AttendanceRisk.EMERGENCY]: {
    color: 'var(--attendance-risk-emergency-color)',
    bgColor: 'var(--attendance-risk-emergency-bg)'
  },
  [AttendanceRisk.VERY_URGENT]: {
    color: 'var(--attendance-risk-very-urgent-color)',
    bgColor: 'var(--attendance-risk-very-urgent-bg)'
  },
  [AttendanceRisk.URGENT]: {
    color: 'var(--attendance-risk-urgent-color)',
    bgColor: 'var(--attendance-risk-urgent-bg)'
  },
  [AttendanceRisk.LESS_URGENT]: {
    color: 'var(--attendance-risk-less-urgent-color)',
    bgColor: 'var(--attendance-risk-less-urgent-bg)'
  },
  [AttendanceRisk.NOT_URGENT]: {
    color: 'var(--attendance-risk-not-urgent-color)',
    bgColor: 'var(--attendance-risk-not-urgent-bg)'
  }
}
