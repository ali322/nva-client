import * as React from 'react'
import { ipcRenderer } from 'electron'
import { inject } from 'mobx-react'
import { Select } from '@/component'
import t from '@/locale'
import registry from '@/config/npm-registry.json'
import PKGJson from '../../../../package.json'

@inject((stores: any) => ({
  locale: stores.root.locale,
  changeLocale: stores.root.changeLocale
}))
export default class Common extends React.Component<any, any> {
  render() {
    const { settings, saveSettings, locale, changeLocale } = this.props
    const message = t(locale)
    const registries: any[] = Object.keys(registry).map((k: any) => ({
      label: message[k],
      value: (registry as Record<string, string>)[k]
    }))
    const locales: Record<string, string>[] = [
      { label: 'English', value: 'en' },
      { label: '中文', value: 'cn' }
    ]
    return (
      <div className="pt-12">
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.currentVersion}</div>
          <div className="flex-3">
            <span className="text-md link" onClick={() => {
              ipcRenderer.send('check-update', PKGJson.version)
            }}>{PKGJson.version}</span>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.checkUpdate}</div>
          <div className="flex-3">
            <Switch size="sm" active={settings.selfUpdateCheck} onChange={(actived: boolean) => {
              saveSettings('selfUpdateCheck', actived)
            }}></Switch>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.language}</div>
          <div className="flex-3">
            <Select data={locales}
              onChange={(val: any) => {
                changeLocale(val)
              }} value={locale}></Select>
          </div>
        </div>
        <div className="d-flex align-items-center py-16">
          <div className="text-right text-md align-middle flex-1 pr-20">{message.npmRegistry}</div>
          <div className="flex-3">
            <Select data={registries}
              onChange={(val: any) => {
                saveSettings('npmRegistry', val)
              }} value={settings.npmRegistry}></Select>
          </div>
        </div>
      </div>
    )
  }
}
