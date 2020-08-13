import * as React from 'react'
import { inject } from 'mobx-react'
import { merge } from 'lodash'
import { autobind } from 'core-decorators'
import { Toast, Tabs, TabsPanel } from '@/component'
import t from '@/locale'
import ProjectSetup from './project'
import CommonSetup from './common'
import AdvanceSetup from './advance'

@inject((stores: any) => ({
  locale: stores.root.locale,
  auth: stores.root.auth,
  settings: stores.root.settings,
  saveSettings: stores.root.saveSettings
}))
export default class Setup extends React.Component<any, any> {
  toast!: any
  @autobind
  saveSettings(key: string, val: any) {
    const { saveSettings, settings } = this.props
    saveSettings(merge({}, settings, { [key]: val }))
  }
  render() {
    const { settings, locale } = this.props
    const message = t(locale)
    return (
      <div className="h-100">
        <div className="position-relative pt-8">
          <Tabs value="common" className="pl-32">
            <TabsPanel name="common" label={message.commonSettings}>
              <CommonSetup settings={settings} saveSettings={this.saveSettings}></CommonSetup>
            </TabsPanel>
            <TabsPanel name="project" label={message.projectSettings}>
              <ProjectSetup settings={settings} saveSettings={this.saveSettings}
                onError={(val: string) => this.toast.error(val)}></ProjectSetup>
            </TabsPanel>
            <TabsPanel name="advance" label={message.advanceSettings}>
              <AdvanceSetup></AdvanceSetup>
            </TabsPanel>
          </Tabs>
        </div>
        <Toast ref={(ref: any) => this.toast = ref}/>
      </div>
    )
  }
}
