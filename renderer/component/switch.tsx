import * as React from 'react'

interface props{
  active?: boolean,
  size?: string,
  onChange?: (val: boolean) => void
}

const Switch = ({active = false, size = '', onChange = () => {}}: props) => {
  const [val, setVal] = React.useState(active)
  return (
    <span onClick={() => {
      setVal(!val)
      onChange(!val)
    }}
     className={`switch switch--round ${size ? 'switch--' + size : ''} ${val ? 'switch--checked' : ''}`}>
      <span className="switch__inner"></span>
    </span>
  )
}

export default Switch