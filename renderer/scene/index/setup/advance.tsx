import * as React from 'react'
import { shell, remote  } from 'electron'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { join } from 'path'
import { homedir } from 'os'
import { Switch } from '@/component'

const win: Electron.BrowserWindow = remote.getCurrentWindow()

const cachePath = join(homedir(), '.npminstall_tarball')

@inject((stores: any) => ({
  saveNetwork: stores.root.saveNetwork
}))
@observer
export default class Advance extends React.Component<any, any>{
  @observable modalActived: boolean = false
  render() {
    const openPath = (path: string) => {
      shell.showItemInFolder(path)
    }
    return (
      <div className="pt-12">
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">npm缓存</div>
          <div className="flex-6">
            <a href="javascript:void(0)" className="text-md" onClick={() => openPath(cachePath)}>{cachePath}</a>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">控制台</div>
          <div className="flex-6">
            <Switch size="sm" active={false} onChange={(actived: boolean): void => {
              if (actived) {
                win.webContents.openDevTools()
              } else {
                win.webContents.closeDevTools()
              }
            }}/>
          </div>
        </div>
      </div>
    )
  }
}
