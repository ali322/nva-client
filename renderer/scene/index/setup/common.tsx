import * as React from 'react'
import { ipcRenderer } from 'electron'
import { inject } from 'mobx-react'
import { Select } from '@/component'
import registry from '@/config/npm-registry.json'
import PKGJson from '../../../../package.json'

@inject((stores: any) => ({
  network: stores.root.network
}))
export default class Common extends React.Component<any, any>{
  render() {
    const { settings, saveSettings } = this.props
    const registries: any[] = Object.keys(registry).map((k: any) => ({
      label: k,
      value: (registry as Record<string, string>)[k]
    }))
    return (
      <div className="pt-12">
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">当前版本</div>
          <div className="flex-6">
            <a href="javascript:void(0)" className="text-md" onClick={() => {
              ipcRenderer.send('check-update')
            }}>{PKGJson.version}</a>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">镜像源</div>
          <div className="flex-6">
            <Select data={registries} placeholder="请选择镜像源" 
              onChange={(val: any) => {
              saveSettings('npmRegistry', val)
            }} value={settings.npmRegistry}></Select>
          </div>
        </div>
      </div>
    )
  }
}
