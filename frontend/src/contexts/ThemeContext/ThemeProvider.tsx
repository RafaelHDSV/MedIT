import { useCallback, useState, type ReactNode } from 'react'
import type { ColorScheme } from './themeConstants'
import { ThemeContext } from './ThemeContext'
import {
  applyColorScheme,
  persistColorScheme,
  readAppliedColorScheme,
  resolveColorScheme
} from './themeUtils'

function getInitialTheme(): ColorScheme {
  return readAppliedColorScheme() ?? resolveColorScheme()
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ColorScheme>(getInitialTheme)

  const setTheme = useCallback((next: ColorScheme) => {
    setThemeState(next)
    persistColorScheme(next)
    applyColorScheme(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next: ColorScheme = current === 'dark' ? 'light' : 'dark'
      persistColorScheme(next)
      applyColorScheme(next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
