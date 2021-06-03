import { join, resolve } from 'path'
import { ensureDirSync, readJsonSync, writeFileSync } from 'fs-extra'
import download from './download'

function writePKGJson(
  name: string,
  path: string,
  info: Record<string, any>
): Record<string, any> {
  let json = readJsonSync(resolve(path, 'package.json'))
  json['name'] = name
  json['description'] = info.description
  json['version'] = info.version
  json['author'] = info.author
  json['license'] = info.license
  json['repository'] = {
    type: 'git',
    url: `git+${info.respository}`
  }
  json['bugs'] = { url: '' }
  json['homepage'] = ''
  // writeJsonSync(resolve(path, 'package.json'), json)
  writeFileSync(resolve(path, 'package.json'), JSON.stringify(json, null, 2))
  return json
}

export function saveDeps(path: string, deps: Record<string, any>, saveDev = false): void {
  let json = readJsonSync(resolve(path, 'package.json'))
  if (saveDev) {
    json['devDependencies'] = Object.assign({}, json['devDependencies'], deps)
  } else {
    json['dependencies'] = Object.assign({}, json['dependencies'], deps)
  }
  writeFileSync(resolve(path, 'package.json'), JSON.stringify(json, null, 2))
}

export async function generateProject(
  name: string,
  path: string,
  repo: string,
  info: Record<string, any>,
  onProgress: (progress: Record<string, any>) => void
): Promise<boolean> {
  const dest = join(path, name)
  try {
    ensureDirSync(dest)
    await download(repo, dest, onProgress)
    writePKGJson(name, dest, info)
    return true
  } catch (err) {
    console.log('err', err)
    return false
  }
}
