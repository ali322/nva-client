import * as React from 'react'
import { Switch } from '@/component'

interface props{
  settings: any,
  saveSettings: (key: string, val: any) => void,
  onError?: (val: string) => void
}

export default ({saveSettings, settings, onError = () => {}}: props) => {
  const checkPort = (port: number) => {
    return port < 1024 || port > 65535
  }
  return (
    <div className="pt-12">
      <div className="d-flex align-items-center py-16">
        <div className="text-right text-md align-middle flex-1 pr-20">开发端口</div>
        <div className="flex-6">
          <div className="input-wrapper">
            <input type="text" className="input input--sm" placeholder="开发服务端口"
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
        <div className="text-right text-md align-middle flex-1 pr-20">开发端口</div>
        <div className="flex-6">
          <div className="input-wrapper">
            <input type="text" className="input input--sm" placeholder="预览服务端口"
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
        <div className="text-right text-md align-middle flex-1 pr-20">分析编译</div>
        <div className="flex-6">
          <Switch size="sm" active={settings.profile} onChange={(actived: boolean) => {
            saveSettings('profile', actived)
          }}></Switch>
        </div>
      </div>
      <div className="d-flex align-items-center py-16">
        <div className="text-right text-md align-middle flex-1 pr-20">更新检测</div>
        <div className="flex-6">
          <Switch size="sm" active={settings.upgradeCheck} onChange={(actived: boolean) => {
            saveSettings('upgradeCheck', actived)
          }}></Switch>
        </div>
      </div>
    </div>
  )
}