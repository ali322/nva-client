import * as React from 'react'
import styled from 'styled-components'
import { observer, inject } from 'mobx-react'
import { autobind } from 'core-decorators'
import ProjectExtra from './project-extra'
import { Toast, Icon } from '@/component'
import t from '@/locale'
import Term from './term'

interface TComponent {
  [prop: string]: any
}

@inject((stores: any) => ({
  locale: stores.root.locale,
  auth: stores.root.auth,
  userSettings: stores.root.settings,
  running: stores.root.project.running,
  currentRunning: stores.root.project.currentRunning,
  percentage: stores.root.project.percentage,
  finished: stores.root.project.finished,
  ready: stores.root.project.ready,
  saveState: stores.root.project.saveState,
  userProjects: stores.root.userProjects,
  saveUserProjects: stores.root.saveUserProjects
}))
@observer
export default class Project extends React.Component<any, any> {
  term!: any
  extra!: any
  toast!: any
  @autobind
  run(act: string) {
    const { running, saveState } = this.props
    if (running) {
      saveState('running', false)
      saveState('currentRunning', '')
      saveState('finished', false)
      saveState('percentage', 0)
      this.term.stop()
    } else {
      let cb = (this as TComponent)[act]
      saveState('running', true)
      saveState('currentRunning', act)
      cb()
    }
  }
  @autobind
  dev() {
    const { path, userSettings, saveState } = this.props
    saveState('percentage', 0)
    let args = [
      '--path',
      path,
      '--port',
      userSettings.devPort,
      '--output',
      userSettings.output,
      '--source',
      userSettings.source
    ]
    if (userSettings.profile) {
      args.push('--profile')
    }
    this.term.run('dev.js', args, (data: any) => {
      let matches = data.toString().match(/\[(\d+)%\]/)
      if (matches) {
        saveState('percentage', parseInt(matches[1]))
      }
      if (data.toString().includes('开发服务运行在')) {
        saveState('percentage', 100)
        saveState('finished', true)
      }
    })
  }
  @autobind
  build() {
    const { path, userSettings, saveState} = this.props
    let args = [
      '--path',
      path,
      '--output',
      userSettings.output,
      '--source',
      userSettings.source
    ]
    if (userSettings.profile) {
      args.push('--profile')
    }
    this.term.run('build.js', args, (data: any) => {
      let matches = data.toString().match(/\[(\d+)%\]/)
      if (matches) {
        saveState('percentage', parseInt(matches[1]))
      }
      if (data.toString().includes('项目打包完成')) {
        saveState('percentage', 100)
        saveState('finished', true)
      }
    })
  }
  @autobind
  preview() {
    const { path, userSettings, saveState } = this.props
    saveState('percentage', 0)
    this.term.run('task.js', [
      '--path',
      path,
      '--name',
      'preview',
      '--port',
      userSettings.previewPort,
      '--output',
      userSettings.output
    ])
  }
  @autobind
  installPKG(pkgs: any[] = []) {
    const { saveState } = this.props
    saveState('ready', false)
    this.term.stop()
    const { path, userSettings } = this.props
    const args = ['--path', path, '--registry', userSettings.npmRegistry]
    this.term.run(
      'install.js', 
      pkgs.length > 0 ? args.concat(['--pkg', pkgs.join(',')]) : args,
      (data: any) => {
        if (data.toString().includes('依赖包安装完成')) {
          saveState('ready', true)
        }
      }
    )
  }
  renderHeader() {
    const { toggleDrawer, running, currentRunning, finished, path, name, locale } = this.props
    const message = t(locale)
    return (
      <div className="header-border py-12 bg-white d-flex">
        <div className="d-flex justify-content-center align-items-center pl-32">
          <div className="text-xl pr-2">{name}</div>
        </div>
        <button onClick={toggleDrawer} className="outline-0 pl-8 pt-4 border-0 bg-transparent line-height-25 cursor-pointer">
          <Icon type="arrow-dropdown"></Icon>
        </button>
        <div className="flex-1 text-left pl-12">
          <button 
            className={`btn mr-12 ${running && currentRunning === 'dev' ? 'btn-outline-danger' : 'btn-outline-primary'}`}
            onClick={() => this.run('dev')}
            disabled={currentRunning !== 'dev' && running}>
            <Icon type="build" size={14}></Icon>
            <span className="pl-4">{currentRunning === 'dev' ? '停止开发' : message.runDev}</span>
          </button>
          <button className={`btn mr-12 ${running && currentRunning === 'build' ? 'btn-outline-danger' : 'btn-outline-warning'}`}
            onClick={() => this.run('build')}
            disabled={currentRunning !== 'build' && running}>
            <Icon type="save"></Icon>
            <span className="pl-4">{currentRunning === 'build' ? '停止打包' : message.releaseProject}</span>
          </button>
          <button className={`btn ${running && currentRunning === 'preview' ? 'btn-outline-danger' : 'btn-outline-success'}`}
            onClick={() => this.run('preview')}
            disabled={currentRunning !== 'preview' && running}>
            <Icon type="eye"></Icon>
            <span className="pl-4">{currentRunning === 'preview' ? '停止预览' : message.previewProject}</span>
          </button>
        </div>
        <ProjectExtra 
          installPKG={this.installPKG} 
          canReport={finished} path={path} 
          ref={(ref: any) => this.extra = ref} />
      </div>
    )
  }
  renderProgress() {
    const { percentage, path, locale } = this.props
    const message = t(locale)
    return (
      <div className="project-progress position-relative">
        <div style={{ width: `${percentage}%` }} className="process-percentage"></div>
        <div className="process-inner d-flex align-items-center">
          <div className="process-leading flex-1">
            <p className="m-0 line-height-25 pl-20">
              <label className="m-0 pr-8 text-sm">{message.projectPath}:</label>
              <a href="javascript:void(0)" className="text-muted text-sm">{path}</a>
            </p>
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <StyledProject className="h-100">
        {this.renderHeader()}
        {this.renderProgress()}
        <div className="project-term">
          <Term ref={(ref: any) => this.term = ref}></Term>
        </div>
        <Toast ref={(ref: any) => this.toast = ref}></Toast>
      </StyledProject>
    )
  }
}

const StyledProject = styled.div`
  .report{
    cursor: pointer;
    position: fixed;
    bottom: 30px;
    right: 20px;
    width: 40px;
    height: 40px;
    z-index: 9999;
    background-color: rgba(255, 255, 255, 0.7);
  }
  .project-progress {
    background: rgb(252, 252, 252);
    box-shadow: 0 1px 1px rgba(14, 13, 13, 0.1);
    height: 35px;
    .process-percentage {
      background: #0f76fd;
      position: absolute;
      bottom: 0;
      opacity: 0.6;
      height: 3px;
    }
    .process-inner {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }
    .process-leading {
      color: #666;
      box-sizing: content-box;
    }
  }
  .project-term{
    height: 652px;
  }
`