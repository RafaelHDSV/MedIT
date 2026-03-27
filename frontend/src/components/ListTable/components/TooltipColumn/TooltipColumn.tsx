import { Tooltip } from 'antd'

function TooltipColumn({ text }: { text: string }) {
  return (
    <div className='ellipsis'>
      <Tooltip title={text || 'n/a'}>{text || 'n/a'}</Tooltip>
    </div>
  )
}

export default TooltipColumn
