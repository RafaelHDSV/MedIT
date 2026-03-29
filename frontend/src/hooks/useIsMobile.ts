import { useEffect, useState } from 'react'

const DEFAULT_MAX_WIDTH_PX = 768

export function useIsMobile(maxWidthPx: number = DEFAULT_MAX_WIDTH_PX) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidthPx}px)`)
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [maxWidthPx])

  return isMobile
}
