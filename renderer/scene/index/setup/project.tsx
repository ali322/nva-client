import * as React from 'react'
import { Switch } from '@/component'
import t from '@/locale'
import { inject } from 'mobx-react';

@inject((stores: any) => ({
  locale: stores.root.locale
}))
export default class ProjectSettings extends React.Component<any, any>{
  render() {
    const { saveSettings, settings, onError, locale } = this.props
    const checkPort = (port: number) => {
      return port < 1024 || port > 65535
    }
    const message = t(locale)
    return (
      <div className="pt-12">
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.devPort}</div>
          <div className="flex-3">
            <div className="input-wrapper">
              <input type="text" className="input input--sm" placeholder={message.devPort}
              style={{width: '300px'}}
              value={settings.devPort} onChange={(e: any) => {
                if (checkPort(e.target.value)) {
                  saveSettings('devPort', e.target.value)
                } else {
                  onError('开发端口不正确')
                }
              }}/>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.previewPort}</div>
          <div className="flex-3">
            <div className="input-wrapper">
              <input type="text" className="input input--sm" placeholder={message.previewPort}
              style={{width: '300px'}}
              value={settings.previewPort} onChange={(e: any) => {
                if (checkPort(e.target.value)) {
                  saveSettings('previewPort', e.target.value)
                } else {
                  onError('预览端口不正确')
                }
              }}/>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.analyzeCompile}</div>
          <div className="flex-3">
            <Switch size="sm" active={settings.profile} onChange={(actived: boolean) => {
              saveSettings('profile', actived)
            }}></Switch>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.checkUpdate}</div>
          <div className="flex-3">
            <Switch size="sm" active={settings.upgradeCheck} onChange={(actived: boolean) => {
              saveSettings('upgradeCheck', actived)
            }}></Switch>
          </div>
        </div>
      </div>
    )
  }
}
