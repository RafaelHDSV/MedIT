import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react'
import type { DemoLoginPersona } from './presentationData'

type AutofillHandler = () => void | Promise<void>

interface IDemoAutofillContextValue {
  enabled: boolean
  loginPersona: DemoLoginPersona
  setLoginPersona: (persona: DemoLoginPersona) => void
  registerAutofill: (handler: AutofillHandler) => () => void
  triggerAutofill: () => Promise<boolean>
}

const DemoAutofillContext = createContext<IDemoAutofillContextValue | null>(
  null
)

export function isDemoAutofillEnabled(): boolean {
  return import.meta.env.VITE_DEMO_AUTOFILL !== 'false'
}

export function DemoAutofillProvider({ children }: { children: ReactNode }) {
  const enabled = isDemoAutofillEnabled()
  const handlerStackRef = useRef<AutofillHandler[]>([])
  const [loginPersona, setLoginPersona] = useState<DemoLoginPersona>('admin')

  const registerAutofill = useCallback((handler: AutofillHandler) => {
    handlerStackRef.current.push(handler)
    return () => {
      handlerStackRef.current = handlerStackRef.current.filter(
        (item) => item !== handler
      )
    }
  }, [])

  const triggerAutofill = useCallback(async () => {
    if (!enabled) return false

    const handler =
      handlerStackRef.current[handlerStackRef.current.length - 1]
    if (!handler) return false

    await handler()
    return true
  }, [enabled])

  const value = useMemo(
    () => ({
      enabled,
      loginPersona,
      setLoginPersona,
      registerAutofill,
      triggerAutofill
    }),
    [enabled, loginPersona, registerAutofill, triggerAutofill]
  )

  if (!enabled) {
    return <>{children}</>
  }

  return (
    <DemoAutofillContext.Provider value={value}>
      {children}
    </DemoAutofillContext.Provider>
  )
}

export function useDemoAutofillContext() {
  return useContext(DemoAutofillContext)
}
