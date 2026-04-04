import type { IError } from '@/interfaces/IError'
import { message } from 'antd'
import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse
} from 'axios'

export interface IRepository {
  api: AxiosInstance
  path: string
}

export class Repository {
  protected api: AxiosInstance
  protected path: string

  constructor({ api, path }: IRepository) {
    this.api = api
    this.path = path
  }

  async handle<T>(
    request: () => Promise<AxiosResponse<T>>
  ): Promise<T | undefined> {
    try {
      const response = await request()
      return response.data
    } catch (err) {
      if (!axios.isAxiosError(err)) return
      const error = err as AxiosError<IError>
      console.error(error)
      message.error(error.response?.data?.message)
    }
  }
}
