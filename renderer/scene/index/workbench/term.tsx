import * as React from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import { Terminal } from 'xterm'
// import { throttle } from 'lodash'
// import * as fit from 'xterm/lib/addons/fit/fit'
import { FitAddon } from 'xterm-addon-fit'
// import {  FitAddon } from 'xterm-addon-fit'
import { spawn, exec } from '@/lib/index'

let win: any = remote.getCurrentWindow()
let term: any
let worker: any

win.on('close', () => {
  term = null
  worker.kill()
})

export default class Term extends React.PureComponent<any, any> {
  componentDidMount() {
    term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 12,
      rendererType: 'canvas',
      lineHeight: 1.2,
      fontFamily: 'courier-new, courier, monospace'
    })
    let termBox = document.getElementById('xterm-container')
    if (termBox) {
      const fitAddon = new FitAddon()
      term.loadAddon(fitAddon)
      term.open(termBox)
      fitAddon.fit()
      // term.fit()
    }
  }
  componentWillUnmount() {
    win = null
    worker = null
  }
  run(
    cmd: string,
    args: any[],
    env: Record<string, any> = {},
    handleData: any = () => { },
    done: any = () => { }
  ) {
    term.clear()
    this.focus()
    console.log('env', env)
    worker = spawn(cmd, args, env, term, handleData, done)
  }
  exec(
    cmd: string,
    path: string,
    handleData: any = () => { },
    done: any = () => { }
  ) {
    term.clear()
    this.focus()
    worker = exec(cmd, path, term, handleData, done)
  }
  focus() {
    term.focus()
  }
  stop() {
    term.clear()
    if (worker) {
      worker.connected && worker.disconnect()
      worker.kill()
      worker = null
    }
  }
  render() {
    return (
      <StyledTerm id="xterm-container" className="h-100 position-relative bg-gray-darker">
      </StyledTerm>
    )
  }
}

const StyledTerm = styled.div`
  overflow: hidden;
  height: 100%;
  width: 100%;
  // width: 924px !important;
  // height: 652px !important;
  .terminal-cursor {
    display: none;
  }
  .xterm{
    height: 100%;
    padding: 10px 0 12px;
  }
  .xterm-screen{
    margin-left: 5px;
    padding-top: 10px;
  }
  .xterm .xterm-viewport::-webkit-scrollbar {
    width: 6px;
  }
  .xterm .xterm-viewport::-webkit-scrollbar-track {
    background: #000;
  }
  .xterm .xterm-viewport::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #1A1D24;
  }
`
