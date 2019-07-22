import * as React from 'react'

interface props {
  type: string,
  size?: number,
  color?: string
}

export default ({type, size = 14, color = 'inhreit'}: props) => {
  return (
    <i className={`icon ion-md-${type}`} style={{fontSize: `${size}px`, color}}></i>
  )
}