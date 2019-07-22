import * as React from 'react'
import { remote } from 'electron'
import styled from 'styled-components'
import Icon from '@/component/icon'

let win: Electron.BrowserWindow = remote.getCurrentWindow()

export default (props: any) => {
  const close = () =>win.close()
  const minimize = () => win.minimize()
  // const maximize = () => win.maximize()
  return (
    <Styled>
      <div className="toolbar d-flex">
        <div className="toolbar-dragger flex-1">{props.children}</div>
        <button onClick={minimize} className="toolbar-item text-md border-0 p-0">
          <Icon type="remove" size={10}></Icon>
        </button>
        <button onClick={close} className="toolbar-item text-md border-0 p-0">
          <Icon type="close" size={14}></Icon>
        </button>
      </div>
    </Styled>
  )
}

const Styled = styled.div`
  position: absolute;
  -webkit-user-select: none;
  top: 0;
  left: 0;
  right: 0;
  height: 25px;
  z-index: 999;

  .toolbar {
    -webkit-user-select: none;
    .toolbar-dragger {
      -webkit-app-region: drag;
    }
    .toolbar-item {
      background: transparent;
      width: 25px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.6);
      cursor: pointer;
      -webkit-appearance: none;
    }
  }
`