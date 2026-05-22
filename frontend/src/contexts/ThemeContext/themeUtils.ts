import type { ColorScheme } from './themeConstants'
import { THEME_STORAGE_KEY } from './themeConstants'

export function resolveColorScheme(): ColorScheme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* ignore */
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

export function readAppliedColorScheme(): ColorScheme | null {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return null
}

export function applyColorScheme(theme: ColorScheme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function persistColorScheme(theme: ColorScheme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    /* ignore */
  }
}
