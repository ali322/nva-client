import { outputFile, emptyDir, remove } from 'fs-extra'
import { join } from 'path'
import { tmpdir } from 'os'

export const capturedDir = tmpdir()

export function saveCaptured(file: any): Promise<any> {
  return new Promise((resolve, reject): void => {
    const url = join(capturedDir, `${Date.now()}.png`)
    outputFile(url, file.toPNG(), (err: Error): void => {
      if (err) {
        reject(err)
      } else {
        resolve(url)
      }
    })
  })
}

export function clearCaptured(): Promise<any> {
  return new Promise((resolve, reject): void => {
    emptyDir(capturedDir, (err: Error): void => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}

export function deleteCaptured(file: any): Promise<any> {
  return new Promise((resolve, reject): void => {
    remove(file, (err: Error): void => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}
