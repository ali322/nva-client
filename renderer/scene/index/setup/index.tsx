import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { observable } from 'mobx'
import { ipcRenderer } from 'electron'
import { merge } from 'lodash'
import styled from 'styled-components'
import { autobind } from 'core-decorators'
import { Toast, Tabs, TabsPanel, Modal } from '@/component'
import { clearAll } from '@/lib/storage'
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
@observer
export default class Setup extends React.Component<any, any> {
  @observable modalVisible = false
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
          <StyledButtons>
            <button className="btn btn-outline-danger" onClick={() => this.modalVisible = true}>
              <span>{message.resetApp}</span>
            </button>
          </StyledButtons>
        </div>
        <Modal active={this.modalVisible} width={300} onClose={() => this.modalVisible = false}>
          <div className="py-24">
            <p className="text-center">{message.resetAppNow}</p>
            <div className="d-flex flex-row justify-content-center">
              <button className="btn btn-success px-12 mr-12"
                onClick={() => {
                  clearAll()
                  this.modalVisible = false
                  ipcRenderer.send('restart')
                }}>
                <span>{message.confirm}</span>
              </button>
              <button className="btn btn-secondary px-12"
                onClick={() => this.modalVisible = false}>
                <span>{message.cancel}</span>
              </button>
            </div>
          </div>
        </Modal>
        <Toast ref={(ref: any) => this.toast = ref}/>
      </div>
    )
  }
}

const StyledButtons = styled.div`
  position: absolute;
  right: 12px;
  top: 4px;
`
