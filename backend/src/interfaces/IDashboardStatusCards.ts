interface IAdminStatusCard {
  entries: number
  inAttendance: number
  attended: number
  occupancy: number
  averageTime: number
  highRisk: number
}

interface IDoctorStatusCard {
  waitingPatients: number
  attended: number
  averageTime: number
  assertiveness: number
}

interface INurseStatusCard {
  waitingPatients: number
  triagedPatients: number
  averageTime: number
}


export interface IDashboardStatusCards  {
  admin: IAdminStatusCard
  doctor: IDoctorStatusCard
  nurse: INurseStatusCard
}