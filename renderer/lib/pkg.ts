import { resolve, join, sep } from 'path'
import { readJsonSync } from 'fs-extra'
import { differenceWith, map, isEqual, isEmpty } from 'lodash'
import globby from 'globby'
import https from 'https'

export interface Package {
  name: string;
  current: string;
  latest: string;
}

function packageVersion(name: string, registry: string): Promise<any> {
  return new Promise((resolve: Function, reject: Function): void => {
    console.log('name', `${registry}/${name}`)
    https.get(`${registry}${name}`, (ret: any): void => {
      if (ret.statusCode !== 200) {
        ret.destroy()
        reject(new Error(`${registry} returned ${ret.statusCode}`))
      } else {
        let bufs: any[] = []
        ret.on('data', bufs.push.bind(bufs))
        ret.on('end', (): void => {
          const data = Buffer.concat(bufs)
          resolve(Object.keys(JSON.parse(data.toString()).versions))
        })
      }
    })
  })
}

export async function checkPKG(
  path: string,
  pkgs: string[] = [],
  registry: string = 'https://registry.npmjs.org/'
): Promise<Package[]> {
  if (pkgs.length > 0) {
    let locals: any = {}
    pkgs.forEach((v: any): void => {
      let version
      try {
        version = readJsonSync(resolve(path, 'node_modules', v, 'package.json'))
          .version
        locals[v] = version
      } catch (e) {
        locals[v] = null
      }
    })
    let latest: Record<string, any> = {}
    try {
      let rets = await Promise.all(
        pkgs.map((v: any): any => packageVersion(v, registry).then((ver: string): Record<string, string> => ({
          [v]: ver.slice(-1)[0]
        })))
      )
      rets.forEach((v: Record<string, any>): void => {
        latest = Object.assign({}, latest, v)
      })
    } catch (e) {
      console.log(e)
    }
    if (isEmpty(latest)) {
      return []
    }
    if (isEqual(latest, locals)) {
      return []
    } else {
      let outdated = differenceWith(
        map(latest, (v, k): any => ({ name: k, version: v })),
        map(locals, (v, k): any => ({ name: k, version: v })),
        (r1, r2): any => r1.version === r2.version
      )
      let upgrade = outdated.map((v: any): any => ({
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

export async function checkUpdate(path: string, registry: string): Promise<Package[]> {
  try {
    const matched = await globby(
      '+(vue|react)/package.json',
      { cwd: join(path, 'node_modules') }
    )
    let pkgs = matched.map((v: string): string => v.split(sep)[0])
    let ret = await checkPKG(path, pkgs, registry)
    return ret
  } catch (err) {
    return []
  }
}
