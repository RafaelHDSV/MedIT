import { useEffect, useState, type ReactNode } from 'react'
import { SettingsContext } from './SettingsContext'

interface ISettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: ISettingsProviderProps) {
  const [canSeeProgressStatus, setCanSeeProgressStatus] = useState(() => {
    const stored = localStorage.getItem('canSeeProgressStatus')
    return stored ? stored === 'true' : true
  })

  useEffect(() => {
    localStorage.setItem('canSeeProgressStatus', String(canSeeProgressStatus))
  }, [canSeeProgressStatus])

  return (
    <SettingsContext.Provider
      value={{
        canSeeProgressStatus,
        setCanSeeProgressStatus
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
