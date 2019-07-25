const builder = require('electron-builder')
const { join } = require('path')
const chalk = require('chalk')

const platform = () => {
  const target = process.env.BUILD_TARGET
  if (target === 'win32') {
    return builder.Platform.WINDOWS.createTarget(null, builder.Arch.ia32)
  } else if (target === 'darwin') {
    return builder.Platform.MAC.createTarget()
  }
}

const resolve = path => join(__dirname, '..', path)

const start = () => {
  return builder.build({
    targets: platform(),
    config: {
      productName: 'nva-client',
      appId: 'org.alilab.nva.client',
      asar: true,
      directories: {
        app: resolve('.'),
        output: resolve('output')
      },
      files: [
        '**/dist/**/*',
        '**/term/**/*'
      ],
      dmg: {
        contents: [
          {
            x: 130,
            y: 150,
            type: 'file'
          },
          {
            x: 410,
            y: 150,
            type: 'link',
            path: '/Applications'
          }
        ]
      },
      mac: {
        target: ['dmg', 'zip'],
        icon: resolve('script/icons/nva.icns'),
      },
      win: {
        target: ['NSIS', 'zip'],
        icon: resolve('script/icons/nva.ico'),
        artifactName: '${productName}-${version}.${ext}'
      },
      publish: [{
        provider: 'github',
        repo: 'nva-client',
        owner: 'ali322',
        releaseType: 'release'
      }],
      nsis: {
        perMachine: true,
        oneClick: false,
        allowToChangeInstallationDirectory: true
      }
    }
  })
}

start()
  .then(ret => {
    console.log(chalk.green('打包完成'))
  })
  .catch(err => {
    console.log(chalk.red('打包失败'))
    console.error(err)
  })
