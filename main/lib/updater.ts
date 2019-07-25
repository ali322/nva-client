import axios from 'axios'

const release = 'https://api.github.com/repos/ali322/nva-client/releases/latest'
const url = 'https://github.com/Molunerfinn/PicGo/releases/latest'

const compareVersion = (current: any, latest: any): boolean => {
  const currentVersion = current.split('.').map((item: string): number => parseInt(item))
  const latestVersion = latest.split('.').map((item: string): number => parseInt(item))
  let pass = false
  for (let i = 0; i < 3; i++) {
    if (currentVersion[i] < latestVersion[i]) {
      pass = true
    }
  }
  return pass
}

export default async (version: string): Promise<any> => {
  try {
    const ret = await axios.get(release)
    if (ret.status === 200) {
      const latest = ret.data.name
      const hasUpdates = compareVersion(version, latest)
      if (hasUpdates) {
        return {
          version: latest,
          url
        }
      }
      return null
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}
