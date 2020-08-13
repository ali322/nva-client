import * as React from 'react'

interface Props {
  type: string,
  size?: number,
  color?: string
}

export default ({ type, size = 14, color = 'inhreit' }: Props) => {
  return (
    <i className={`icon ion-md-${type}`} style={{ fontSize: `${size}px`, color }}></i>
  )
}
