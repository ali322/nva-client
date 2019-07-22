import * as React from 'react'
import Icon from '@/component/icon'
import { some, reject, includes } from 'lodash'

interface props {
  data: Array<any>,
  onChange: any,
  value: string | string[],
  placeholder?: string,
  width?: number,
  mutiple?: boolean,
  searchable?: boolean
}

export default ({ data, onChange, value, width = 300, mutiple = false, searchable = false, placeholder = '' }: props) => {
  const [focus, setFocus] = React.useState(false)
  const selected = data.filter((v: any) => Array.isArray(value) ? includes(value, v.value) : v.value === value)
  const [val, setVal] = React.useState(selected)
  React.useEffect(() => {
    setVal(selected)
  }, [value])
  const [inputActived, setInputActived] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const renderBanner = () => {
    if (inputActived) {
      return <input autoFocus type="text" className="select__input" onChange={(e: any) => {
        e.stopPropagation()
        setQuery(e.target.value)
      }}/>
    }
    if (val.length > 0) {
      return <span className="select__selected-value">{
        mutiple ? val.map((v: any) => v.label).join(',') : val[0].label
      }</span>
    } else {
      return <span className="select__placeholder">{placeholder}</span>
    }
  }
  return (
    <div className={`select ${focus ? 'select--open select--focus' : ''}`} style={{ width: `${width}px` }}>
      <div className="select__selection" onClick={() => {
        setFocus(!focus)
        if (searchable) {
          setInputActived(!inputActived)
        }
      }}>
        {renderBanner()}
        <span className="select__selection-icon">
          <Icon type="arrow-dropdown"></Icon>
        </span>
      </div>
      <div className="select__menu">
        <div className="list">
          <ul className="list__options">
            {data.filter((item: any) => {
              return query ? item.label.startsWith(query) : true
            }).map((item: any) => (
              <li className="list__item" onClick={() => {
                let next
                if (mutiple) {
                  next = some(val, { value: item.value }) ?
                    reject(val, { value: item.value }) : val.concat([item])
                } else {
                  next = [item]
                }
                setVal(next)
                setFocus(false)
                if (searchable) {
                  setInputActived(false)
                }
                onChange(mutiple ? next.map((v: any) => v.value) : next[0].value)
              }}>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

