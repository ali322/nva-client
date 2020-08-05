import * as React from 'react'

interface Props{
  value: number
}

export default ({ value = 0 }: Props) => {
  return (
    <div className="progress-outer">
      <div className="progress">
        <div className="progress-bar bg-success" style={{ width: `${value}%` }}></div>
      </div>
      <div className="progress-text">{`${value}%`}</div>
    </div>
  )
}
