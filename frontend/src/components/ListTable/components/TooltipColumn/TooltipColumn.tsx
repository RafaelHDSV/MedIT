import { Tooltip } from 'antd'

function TooltipColumn({ text }: { text: string }) {
  const display = text || 'n/a'

  return (
    <div className='ellipsis'>
      <Tooltip title={display}>
        <span className='ellipsis w-100'>{display}</span>
      </Tooltip>
    </div>
  )
}

export default TooltipColumn
