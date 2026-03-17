export interface Script {
  name: string
  description: string
  run(): Promise<void>
}