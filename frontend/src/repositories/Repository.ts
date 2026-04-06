import { type AxiosInstance, type AxiosResponse } from 'axios'

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

  async handle<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
    const response = await request()
    return response.data
  }
}
