import { createContext } from 'react'
import type { ColorScheme } from './themeConstants'

export interface ThemeContextType {
  theme: ColorScheme
  setTheme: (theme: ColorScheme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)
