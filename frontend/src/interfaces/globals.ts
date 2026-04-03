export const UF = {
  AC: 'AC',
  AL: 'AL',
  AP: 'AP',
  AM: 'AM',
  BA: 'BA',
  CE: 'CE',
  DF: 'DF',
  ES: 'ES',
  GO: 'GO',
  MA: 'MA',
  MT: 'MT',
  MS: 'MS',
  MG: 'MG',
  PA: 'PA',
  PB: 'PB',
  PR: 'PR',
  PE: 'PE',
  PI: 'PI',
  RJ: 'RJ',
  RN: 'RN',
  RS: 'RS',
  RO: 'RO',
  RR: 'RR',
  SC: 'SC',
  SP: 'SP',
  SE: 'SE',
  TO: 'TO'
} as const
export type UF = (typeof UF)[keyof typeof UF]

export const Periods = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year'
} as const
export type Periods = (typeof Periods)[keyof typeof Periods]
export const PeriodsLabels: Record<Periods, string> = {
  [Periods.DAY]: 'Dia',
  [Periods.WEEK]: 'Semana',
  [Periods.MONTH]: 'Mês',
  [Periods.YEAR]: 'Ano'
}