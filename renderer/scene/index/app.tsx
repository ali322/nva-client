import * as React from 'react'
import styled from 'styled-components'
import { NavLink, Route, Switch } from 'react-router-dom'
import { ipcRenderer } from 'electron'
import { Icon, Toolbar } from '@/component'
import WorkBench from './workbench'
import Setup from './setup'

export default class App extends React.Component<any, any>{
  componentDidMount() {
    ipcRenderer.on('update-error', (err: Error) => {
      console.error(err)
    })

    ipcRenderer.on('update-not-available', (info: any) => {
      console.log('暂无可用更新', info)
    })

    ipcRenderer.on('update-available', (_: any, info: any) => {
      let notify = new Notification('发现新版本', {
        body: `发现新版本 v${info.version}`
      })

      notify.onclick = () => {
        ipcRenderer.send('open-window', 'updater', {
          version: info.version
        })
      }
    })
  }
  render() {
    return (
      <div className="h-100 position-relative d-flex">
        <Toolbar></Toolbar>
        <StyledSidebar className="d-flex flex-column">
          <div className="layout-logo d-flex justify-content-center align-items-center"></div>
          <div className="layout-menu flex-1">
            <NavLink to="/" activeClassName="active" exact>
              <div className="d-flex full-width align-items-center justify-content-center">
                <Icon type="cube" size={18}></Icon>
                <span className="px-8 d-block text-base">项目</span>
              </div>
            </NavLink>
            <NavLink to="/setup" activeClassName="active">
              <div className="d-flex full-width align-items-center justify-content-center">
                <Icon type="settings" size={18}></Icon>
                <span className="px-8 d-block text-base">设置</span>
              </div>
            </NavLink>
          </div>
          <div className="layout-bottom d-flex justify-content-center align-items-center">
          </div>
        </StyledSidebar>
        <div className="flex-1 position-relative pt-24 bg-white">
          <Switch>
            <Route path="/" exact component={WorkBench} />
            <Route path="/setup" component={Setup} />
          </Switch>
        </div>
      </div>
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