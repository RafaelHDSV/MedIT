import { createContext } from 'react'

interface ISettingsContext {
  canSeeProgressStatus: boolean
  setCanSeeProgressStatus: (value: boolean) => void
}

export const SettingsContext = createContext<ISettingsContext>(
  {} as ISettingsContext
)
