import { useEffect } from 'react'
import { useDemoAutofillContext } from './DemoAutofillContext'

export function useRegisterDemoAutofill(
  handler: () => void | Promise<void>,
  active = true,
  deps: unknown[] = []
) {
  const context = useDemoAutofillContext()

  useEffect(() => {
    if (!context?.enabled || !active) return
    return context.registerAutofill(handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, active, handler, ...deps])
}
