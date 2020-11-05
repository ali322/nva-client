import * as React from 'react'

interface Props {
  className?: string,
  value: string,
  children: any,
  center?: boolean,
  onChange?: (val: string, index: number) => void
}

interface State{
  active: string
}

class Tabs extends React.Component<Props, State> {
  state = {
    active: this.props.value,
    propActive: ''
  }
  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.value !== prevState.propActive) {
      return {
        active: nextProps.value,
        propActive: nextProps.value
      }
    }
    return null
  }
  renderNav() {
    const { children, onChange, className } = this.props
    const { active } = this.state
    return (
      <div className={`tabs-list ${className || ''}`}>
        <ul className="navs navs-tabs navs--light navs--horizontal">
          {React.Children.map(children, (child: any, i: number) => {
            const { label, name } = child.props
            return (
              <li role="presentation" className={`navs__item ${name === active ? 'navs__item--checked' : ''}`} key={i}>
                <span
                  onClick={() => {
                    this.setState({ active: name })
                    onChange && onChange(name, i)
                  }}
                  className="navs-link text-base link"
                >{label}</span>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  render() {
    const { children, center = false } = this.props
    const { active } = this.state
    return (
      <div className={`tabs ${center ? 'tabs--center' : ''}`}>
        {this.renderNav()}
        <div className="tab-content">
          {React.Children.map(children, (child: any, i: number) => React.cloneElement(child, {
            key: i,
            active: child.props.name === active
          }))}
        </div>
      </div>
    )
  }
}

interface PanelProps {
  children: any,
  active?: boolean,
  name: string,
  label: string
}

const TabsPanel = ({ active = false, children }: PanelProps) => {
  return (
    <div className={`tab-pane ${active && 'active'}`}>{children}</div>
  )
}

export {
  TabsPanel
}

export default Tabs
