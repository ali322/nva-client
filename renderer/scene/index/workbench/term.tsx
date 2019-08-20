import * as React from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import { Terminal } from 'xterm'
// import { throttle } from 'lodash'
import * as fit from 'xterm/lib/addons/fit/fit'
// import {  FitAddon } from 'xterm-addon-fit'
import { spawn } from '@/lib/index'

Terminal.applyAddon(fit)

let win: any = remote.getCurrentWindow()
let term: any
let worker: any

win.on('close', () => {
  term = null
  worker.kill()
})

export default class Term extends React.PureComponent<any, any>{
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
    term.open(termBox)
    setImmediate(() => {
      term.fit()
    })
  }
  componentWillUnmount() {
    win = null
    worker = null
  }
  run(
    cmd: string,
    args: any,
    handleData: any = () => {},
    done: any = () => {}
  ) {
    term.clear()
    worker = spawn(cmd, args, term, handleData, done)
  }
  stop() {
    term.clear()
    if (worker) {
      worker.kill()
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
  width: 924px !important;
  height: 652px !important;
  .terminal-cursor {
    display: none;
  }
  .xterm{
    height: 100%;
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
