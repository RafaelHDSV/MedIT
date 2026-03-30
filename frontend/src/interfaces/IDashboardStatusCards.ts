export interface IAdminStatusCard {
  entries: number
  inAttendance: number
  attended: number
  occupancy: number
  averageTime: number
  highRisk: number
}

export interface IDoctorStatusCard {
  waitingPatients: number
  attended: number
  averageTime: number
  assertiveness: number
}

export interface INurseStatusCard {
  waitingPatients: number
  triagedPatients: number
  averageTime: number
}


export interface IDashboardStatusCards  {
  admin: IAdminStatusCard
  doctor: IDoctorStatusCard
  nurse: INurseStatusCard
}