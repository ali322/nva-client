import axios from 'axios'
import { resolve } from 'path'
import { readJsonSync, writeFileSync } from 'fs-extra'
import { differenceWith, map, isEqual, isEmpty } from 'lodash'
import { Package } from '../interface'

export async function checkPKG(
  path: string,
  pkgs: string[] = []
): Promise<Package[]> {
  if (pkgs.length > 0) {
    let locals: any = {}
    pkgs.forEach(v => {
      let version
      try {
        version = readJsonSync(resolve(path, 'node_modules', v, 'package.json'))
          .version
        locals[v] = version
      } catch (e) {
        locals[v] = null
      }
    })
    let rets = await axios.all(
      pkgs.map(v => axios.get(`https://registry.npmjs.org/${v}`))
    )
    let latest: any = {}
    rets.forEach(v => {
      if (v.status === 200) {
        let data: any = v.data
        latest[data.name] = data['dist-tags'].latest
      }
    })
    if (isEmpty(latest)) {
      return []
    }
    if (isEqual(latest, locals)) {
      return []
    } else {
      let outdated = differenceWith(
        map(latest, (v, k) => ({ name: k, version: v })),
        map(locals, (v, k) => ({ name: k, version: v })),
        (r1, r2) => r1.version === r2.version
      )
      let upgrade = outdated.map(v => ({
        name: v.name,
        current: locals[v.name],
        latest: latest[v.name]
      }))
      return upgrade
    }
  } else {
    return []
  }
}

export function writePKGJson(
  name: string,
  path: string,
  answers: Record<string, any>
): Record<string, any> {
  let json = readJsonSync(resolve(path, 'package.json'))
  json['name'] = name
  json['description'] = answers.description
  json['version'] = answers.version
  json['author'] = answers.author
  json['license'] = answers.license
  json['repository'] = {
    type: 'git',
    url: `git+${answers.respository}`
  }
  json['bugs'] = { url: '' }
  json['homepage'] = ''
  // writeJsonSync(resolve(path, 'package.json'), json)
  writeFileSync(resolve(path, 'package.json'), JSON.stringify(json, null, 2))
  return json
}
