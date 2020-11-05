const { resolve } = require('./util')
const { sep, posix, join} = require('path')

exports.sourceFolder = join('renderer', 'scene')
exports.distFolder = join('dist', 'renderer')

exports.distPathOfMain = resolve('dist', 'main')
exports.entryOfMain = resolve('main', 'index')