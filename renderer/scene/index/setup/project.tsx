import * as React from 'react'
import { Switch } from '@/component'
import t from '@/locale'
import { inject } from 'mobx-react'
import { totalmem } from 'os'

@inject((stores: any) => ({
  locale: stores.root.locale
}))
export default class ProjectSettings extends React.Component<any, any> {
  render() {
    const { saveSettings, settings, onError, locale } = this.props
    const checkPort = (port: number) => {
      return port < 65535 && port > 1
    }
    const checkHostname = (hostname: string): boolean => {
      return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) || hostname === 'localhost'
    }
    const totalMemory = totalmem() / (1024 * 1024)
    console.log('totalmem', totalMemory)
    const checkMemoryLimit = (val: number) => {
      return (val > 0 && val < totalMemory) || val === -1
    }
    const message = t(locale)
    return (
      <div className="pt-12">
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.devHost}</div>
          <div className="flex-3">
            <div className="input-wrapper">
              <input type="text" className="input input--sm" placeholder={message.devHost}
                style={{ width: '300px' }}
                value={settings.devHost} onChange={(e: any) => {
                  if (checkHostname(e.target.value)) {
                    saveSettings('devHost', e.target.value)
                  } else {
                    onError(`${message.devHost} ${message.isInvalid}`)
                  }
                }}/>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.devPort}</div>
          <div className="flex-3">
            <div className="input-wrapper">
              <input type="text" className="input input--sm" placeholder={message.devPort}
                style={{ width: '300px' }}
                value={settings.devPort} onChange={(e: any) => {
                  if (checkPort(e.target.value)) {
                    saveSettings('devPort', e.target.value)
                  } else {
                    onError(`${message.devPort} ${message.isInvalid}`)
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
                style={{ width: '300px' }}
                value={settings.previewPort} onChange={(e: any) => {
                  if (checkPort(e.target.value)) {
                    saveSettings('previewPort', e.target.value)
                  } else {
                    onError(`${message.previewPort} ${message.isInvalid}`)
                  }
                }}/>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.ssrPort}</div>
          <div className="flex-3">
            <div className="input-wrapper">
              <input type="text" className="input input--sm" placeholder={message.ssrPort}
                style={{ width: '300px' }}
                value={settings.ssrPort} onChange={(e: any) => {
                  if (checkPort(e.target.value)) {
                    saveSettings('ssrPort', e.target.value)
                  } else {
                    onError(`${message.ssrPort} ${message.isInvalid}`)
                  }
                }}/>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.envMode}</div>
          <div className="flex-3">
            <div className="input-wrapper">
              <input type="text" className="input input--sm" placeholder={message.envMode}
                style={{ width: '300px' }}
                value={settings.env} onChange={(e: any) => {
                  saveSettings('env', e.target.value)
                }}/>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.memLimit}</div>
          <div className="flex-3">
            <div className="input-wrapper">
              <input type="text" className="input input--sm" placeholder={message.memLimit}
                style={{ width: '300px' }}
                value={settings.memoryLimit} onChange={(e: any) => {
                  if (checkMemoryLimit(e.target.value)) {
                    saveSettings('memoryLimit', e.target.value)
                  } else {
                    onError(`${message.memLimit} ${message.isInvalid}`)
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
