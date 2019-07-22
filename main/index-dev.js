/* eslint-disable */

// Set environment for development
process.env.NODE_ENV = 'development'

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

const electron = require('electron')
const os = require('os')
const path = require('path')

// Install `devtools`
// const { default:installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
// electron.app.on('ready', () => {
//   const extensions = [
//         REACT_DEVELOPER_TOOLS
//       ]
//       Promise.all(installExtension.map(ext => installer.default(ext)))
//         .then(() => {})
//         .catch(err => {
//           console.log('Unable to install `react-devtools`: \n', err)
//         })
// })

// Require `main` process to boot app
require('../dist/main/index')