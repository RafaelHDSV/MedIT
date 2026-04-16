import { useIsMobile } from '@/hooks/useIsMobile'
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import Button from '../Button/Button'

interface IReloadButtonProps {
  onReload: () => void
}

function ReloadButton({ onReload }: IReloadButtonProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Button className='w-100' buttonHeight='2rem' onClick={onReload}>
        Atualizar
      </Button>
    )
  }

  return (
    <Button mode='icon' onClick={onReload}>
      <ArrowCounterClockwiseIcon />
    </Button>
  )
}

export default ReloadButton
