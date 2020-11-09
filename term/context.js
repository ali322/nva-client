const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const hooks = require('./hook')

const onProgress = (output) => {
  let ret = []
  ret.push(chalk.yellow(output[0]))
  ret.push(chalk.white(output[1]))
  output[2] && ret.push(chalk.grey(output[2]))
  console.log(ret.join(''))
}

module.exports = function (options = {}) {
  const namespace = options.namespace ? options.namespace : 'nva'
  return {
    namespace,
    modConfPath: path.resolve(`.${namespace}`, 'bundle.json'),
    vendorConfPath:
      process.env.NODE_ENV === 'production'
        ? path.resolve(`.${namespace}`, 'vendor.json')
        : fs.existsSync(path.resolve(`.${namespace}`, 'vendor.dev.json'))
          ? path.resolve(`.${namespace}`, 'vendor.dev.json')
          : path.resolve(`.${namespace}`, 'vendor.json'),
    hooks: hooks(options.locale),
    watch() {
      console.log(
        chalk.yellow(
          options.locale === 'cn'
            ? '请重启开发服务'
            : 'please restart development service'
        )
      )
    },
    onDevProgress: onProgress,
    onBuildProgress: onProgress,
    onVendorProgress: onProgress,
    proj: options.proj || {},
    logText:
      options.locale === 'cn'
        ? {
          buildSuccess: '编译 %s 成功于 %s 耗时 %dms',
          serverRunning: '开发服务运行在',
          projectInvalid: '项目配置错误',
          moduleInvalid: '模块配置错误',
          fileChanged: `文件 %s 已改变`,
          serverRestart: '服务正在重启...',
          pathInvalid: '%s 不存在',
          vendorInvalid: '依赖包配置错误',
          moduleExisted: '模块 %s 已存在',
          openBrowserFailed: '不能在浏览器打开',
          moduleNotExisted: '模块 %s 不存在, 是否已删除?',
          fileNotExisted: '文件 %s 不存在, 是否已删除?',
          portInvalid: '端口已被占用',
          serverCrashed: '服务已奔溃',
          buildWarn: '编译 %s 完成于 %s 耗时 %dms (包含警告)',
          buildError: '编译 %s 失败于 %s 耗时 %dms',
          wrongType: '不支持的项目类型',
          mockInvalid: '模拟接口配置 %s 错误',
          wrongMethod: '不支持的请求方法',
          mockChange: '模拟接口配置 %s 已改变',
          mockAdd: '模拟接口配置 %s 已添加',
          mockDelete: '模拟接口配置 %s 已删除'
        }
        : null
  }
}
