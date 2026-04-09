import type { IError } from '@/interfaces/IError'
import { message } from 'antd'
import axios, { AxiosError } from 'axios'

interface IHandleApiError {
  err: unknown
  defaultMessage: string
  setFieldErrors?: (errors: { [key: string]: { message: string } }) => void
}

export const handleApiError = ({
  err,
  defaultMessage,
  setFieldErrors
}: IHandleApiError) => {
  if (!axios.isAxiosError(err)) return
  const error = err as AxiosError<IError>

  if (error.response?.data.errors) {
    setFieldErrors?.(error.response?.data.errors)
  }

  console.error(error)
  message.error(error.response?.data?.message || defaultMessage)
}
