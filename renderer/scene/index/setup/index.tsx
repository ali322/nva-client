import * as React from 'react'
import { inject } from 'mobx-react'
import { merge } from 'lodash'
import { autobind } from 'core-decorators'
import { Toast, Tabs, TabsPanel } from '@/component'
import ProjectSetup from './project'
import CommonSetup from './common'
import AdvanceSetup from './advance'

@inject((stores: any) => ({
  auth: stores.root.auth,
  settings: stores.root.settings,
  saveSettings: stores.root.saveSettings
}))
export default class Setup extends React.Component<any, any>{
  toast!: any
  @autobind
  saveSettings(key: string, val: any) {
    const { saveSettings, settings } = this.props
    saveSettings(merge({}, settings, { [key]: val }))
  }
  render() {
    const { settings } = this.props
    return (
      <div className="h-100">
        <div className="position-relative pt-8">
          <Tabs value="common" className="pl-32">
            <TabsPanel name="common" label="通用设置">
              <CommonSetup settings={settings} saveSettings={this.saveSettings}></CommonSetup>
            </TabsPanel>
            <TabsPanel name="project" label="项目设置">
              <ProjectSetup settings={settings} saveSettings={this.saveSettings} 
                onError={(val: string) => this.toast.error(val)}></ProjectSetup>
            </TabsPanel>
            <TabsPanel name="advance" label="高级设置">
              <AdvanceSetup></AdvanceSetup>
            </TabsPanel>
          </Tabs>
        </div>
        <Toast ref={(ref: any) => this.toast = ref}/>
      </div>
    )
  }
}
