import { isFunction } from 'lodash'
import { remote } from 'electron'
import { join } from 'path'
import { readdir, existsSync } from 'fs'

export function exec(cmd: string, path: string, t: any, done: any): any {
  let worker = require('child_process').exec(cmd, {
    cwd: path,
    shell: true
  })
  worker.stdout.on('data', (data: any): void => {
    data
      .toString()
      .split(/\n/)
      .forEach((v: string): void => {
        t.writeln(v)
      })
  })
  if (isFunction(done)) {
    worker.stdout.on('end', done)
  }

  worker.stderr.on('data', (data: any): void => {
    data
      .toString()
      .split(/\n/)
      .forEach((v: string): void => {
        t.writeln(v)
      })
  })
  t.on('data', (data: any): void => {
    if (worker.connected) {
      worker.stdin.write(data)
    }
  })
  worker.on('error', (err: Error): void => console.log(err))

  return worker
}

export function execFile(cmd: string, args: any): any {
  const file = join(__dirname, '..', '..', 'term', cmd)
  let worker
  if (process.env.NODE_ENV === 'development') {
    worker = require('child_process').fork(join(file), args, {
      env: {
        TERM: 'xterm'
      },
      silent: true
    })
  } else {
    worker = require('child_process').fork(
      join(remote.app.getAppPath(), file),
      args,
      {
        env: {
          TERM: 'xterm'
        },
        silent: true
      }
    )
  }
  return worker
}

export function spawn(
  cmd: string,
  args: any,
  t: any,
  handleData: any = (): void => {},
  done: any = (): void => {}
): any {
  let worker = execFile(cmd, args)
  worker.stdout.on('data', (data: any): void => {
    data
      .toString()
      .split(/\n/)
      .forEach((v: string): void => {
        t.writeln(v)
      })
  })
  if (isFunction(done)) {
    worker.stdout.on('end', done)
  }
  worker.stderr.on('data', (data: any): void => {
    data
      .toString()
      .split(/\n/)
      .forEach((v: string): void => {
        t.writeln(v)
      })
  })

  t.on('data', (data: any): void => {
    if (worker.connected) {
      worker.stdin.write(data)
    }
  })
  worker.on('error', (err: Error): void => console.log(err))
  worker.stdout.on('data', handleData)

  return worker
}

export function isEmpty(path: string, cwd: string): Promise<boolean> {
  return new Promise((resolve: any, reject: any): void => {
    let dest = join(cwd, path)
    if (existsSync(dest)) {
      readdir(join(cwd, path), (err: any, files: string[]): void => {
        if (err) return reject(err)
        resolve(files.length === 0)
      })
    } else {
      resolve(true)
    }
  })
}
