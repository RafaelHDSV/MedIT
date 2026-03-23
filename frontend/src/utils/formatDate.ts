import dayjs, { Dayjs } from 'dayjs'

const SERVER_TZ = 'America/Sao_Paulo'

type DateParameter = string | Date | Dayjs | undefined | null

export type FormatDateModes =
  | 'invalidDate'
  | 'at'
  | 'date'
  | 'dateShort'
  | 'datetime'
  | 'datetimeShort'
  | 'datetimeYearShort'
  | 'datetimeYearShortSeparated'
  | 'datetimeLong'
  | 'datetimeWithSeconds'
  | 'datetimeWithAt'
  | 'serverCompleteDate'
  | 'serverMonth'
  | 'yearMonth'
  | 'serverYear'
  | 'displayMonth'
  | 'displayYear'
  | 'monthYear'
  | 'time'
  | 'shortMonthYear'
  | 'timeWithSeconds'
  | 'textInFull'
  | 'textInFullWithYear'
  | 'dateDashed'
  | 'shortYearMonth'
  | 'displayWeek'

interface IFormatDateProps<EmptyValue = string> {
  date: DateParameter
  mode: FormatDateModes
  preserveOriginalTz?: boolean
  emptyValue?: EmptyValue
  _legacyApplyTz?: boolean
}

export function convertDateToClientTz(date: DateParameter): Dayjs {
  const clientTz = dayjs.tz.guess()

  return dayjs.tz(date, SERVER_TZ).tz(clientTz)
}

export function formatDate<EmptyValue = string>({
  date,
  mode,
  preserveOriginalTz,
  emptyValue = 'n/a' as EmptyValue
}: IFormatDateProps<EmptyValue>): EmptyValue extends string
  ? string
  : EmptyValue | string {
  if (!date)
    return emptyValue as EmptyValue extends string ? string : EmptyValue

  try {
    const data =
      typeof date === 'string' && date.includes('/')
        ? dayjs(date, 'DD/MM/YYYY')
        : date
    const formattedDate = !preserveOriginalTz
      ? convertDateToClientTz(data)
      : dayjs(data)
    const isValid = formattedDate.isValid()

    if (!isValid)
      return 'n/a' as EmptyValue extends string ? string : EmptyValue

    const formatKey: Record<FormatDateModes, string> = {
      invalidDate: 'Data inválida',
      date: 'DD/MM/YYYY',
      dateDashed: 'DD-MM-YYYY',
      dateShort: 'DD/MM',
      datetimeShort: 'DD/MM HH:mm',
      datetime: 'DD/MM/YYYY HH:mm',
      datetimeYearShort: 'DD/MM/YY HH:mm',
      datetimeYearShortSeparated: 'DD/MM/YY [-] HH:mm',
      datetimeLong: 'DD/MM/YYYY HH:mm:ss',
      datetimeWithSeconds: 'DD/MM/YYYY [às] HH:mm:ss',
      datetimeWithAt: 'DD/MM/YYYY [às] HH:mm',
      serverCompleteDate: 'YYYY-MM-DD',
      serverMonth: 'YYYY-MM',
      yearMonth: 'YYYYMM',
      serverYear: 'YYYY',
      displayYear: 'YYYY',
      displayWeek: 'DD/MM',
      displayMonth: 'MMMM',
      monthYear: 'MMMM - YYYY',
      shortMonthYear: 'MMM/YYYY',
      time: 'HH:mm',
      timeWithSeconds: 'HH:mm:ss',
      shortYearMonth: 'MMM/YY',
      textInFull: 'DD [de] MMM[. às] HH:mm',
      textInFullWithYear: 'DD [de] MMM[. de] YYYY [às] HH:mm',
      at: 'às'
    }

    const result = formattedDate.format(
      formatKey[mode]
    ) as EmptyValue extends string ? string : EmptyValue | string
    return result
  } catch (err) {
    console.error(err)

    return 'n/a' as EmptyValue extends string ? string : EmptyValue
  }
}

export function formatDateToServer<T extends DateParameter>(date: T): string {
  const serverDate = dayjs.tz(date, SERVER_TZ)

  return serverDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
}
