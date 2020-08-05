import { join } from 'path'
import {
  accessSync,
  existsSync,
  constants,
  readJsonSync
} from 'fs-extra'

export function checkValid(path: string): boolean | Record<string, any> {
  if (!path) return false
  let confPath = join(path, '.nva')
  if (
    !existsSync(join(confPath, 'nva.js')) ||
    !existsSync(join(confPath, 'bundle.json')) ||
    !existsSync(join(confPath, 'vendor.json'))
  ) {
    return false
  }
  let pkgPath = join(path, 'package.json')
  if (!existsSync(pkgPath)) return false
  let pkg = readJsonSync(pkgPath)

  return { name: pkg.name, path }
}

export function checkNodePathValid(path: string): boolean {
  if (!path) return false
  let nodeBinPath = join(
    path,
    process.platform === 'win32' ? 'node.exe' : 'node'
  )
  let npmBinPath = join(path, process.platform === 'win32' ? 'npm.cmd' : 'npm')
  try {
    accessSync(nodeBinPath, constants.F_OK | constants.X_OK)
    accessSync(npmBinPath, constants.F_OK)
  } catch (err) {
    console.log(err, 'err')
    return false
  }
  return true
}
