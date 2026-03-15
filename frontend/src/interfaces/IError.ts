export interface IError {
  message?: string
  errors?: {
    [key: string]: {
      message: string
    }
  }
}
