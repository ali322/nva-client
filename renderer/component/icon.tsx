import * as React from 'react'

interface Props {
  type: string,
  size?: number,
  color?: string,
  hide?: boolean
  className?: string,
  onClick?: (event: any) => void
}

export default ({ type, size = 14, color = 'inhreit', hide = false, className = '', onClick = () => {} }: Props) => {
  return (
    <i className={`icon ion-md-${type} ${className}`} style={{ fontSize: `${size}px`, color, visibility: hide ? 'hidden' : 'visible' }} onClick={onClick}></i>
  )
}
