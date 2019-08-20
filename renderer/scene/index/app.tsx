import * as React from 'react'
import styled from 'styled-components'
import { NavLink, Route } from 'react-router-dom'
import { CacheRoute, CacheSwitch } from '@/component/cache-route'
import { ipcRenderer, shell } from 'electron'
import { inject } from 'mobx-react'
import { Icon, Toolbar } from '@/component'
import t from '@/locale'
import WorkBench from './workbench'
import Setup from './setup'
import PKGJson from '../../../package.json'

export default class App extends React.Component<any, any>{
  componentDidMount() {
    ipcRenderer.send('check-update', PKGJson.version)
    ipcRenderer.on('update-available', (_: any, info: any) => {
      let notify = new Notification('发现新版本', {
        body: `发现新版本 v${info.version}`
      })

      notify.onclick = () => {
        shell.openExternal(info.url)
      }
    })
  }
  render() {
    return (
      <div className="h-100 position-relative d-flex">
        <Toolbar></Toolbar>
        <LayoutSidebar></LayoutSidebar>
        <div className="flex-1 position-relative pt-24 bg-white">
          <CacheSwitch>
            <CacheRoute path="/" exact component={WorkBench} />
            <Route path="/setup" component={Setup} />
          </CacheSwitch>
        </div>
      </div>
    )
  }
}

@inject((stores: any) => ({
  locale: stores.root.locale
}))
class LayoutSidebar extends React.Component<any, any>{
  render() {
    const message = t(this.props.locale)
    return (
      <StyledSidebar className="d-flex flex-column">
        <div className="layout-logo d-flex justify-content-center align-items-center"></div>
        <div className="layout-menu flex-1">
          <NavLink to="/" activeClassName="active" exact>
            <div className="d-flex full-width align-items-center justify-content-center">
              <Icon type="cube" size={18}></Icon>
              <span className="pl-8 d-block text-base">{message.project}</span>
            </div>
          </NavLink>
          <NavLink to="/setup" activeClassName="active">
            <div className="d-flex full-width align-items-center justify-content-center">
              <Icon type="settings" size={18}></Icon>
              <span className="pl-8 d-block text-base">{message.settings}</span>
            </div>
          </NavLink>
        </div>
        <div className="layout-bottom d-flex justify-content-center align-items-center">
        </div>
      </StyledSidebar>
    )
  }
}

const StyledSidebar = styled.div`
  width: 100px;
  background: #1A1D24;
  z-index: 999;
  .layout-bottom {
    padding-bottom: 43px;
  }
  .layout-menu {
    & > a {
      display: flex;
      padding: 18px 0;
      text-align: center;
      cursor: pointer;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.65);
      border-left: 2px solid #1A1D24;
      &.active {
        color: #fff;
        background: #000;
        border-color: #19BB20;
      }
    }
  }
`
