import { Tooltip } from 'antd'

function TooltipColumn({ text }: { text: string }) {
  return (
    <Tooltip title={text}>
      <div className='ellipsis'>{text}</div>
    </Tooltip>
  )
}

export default TooltipColumn
