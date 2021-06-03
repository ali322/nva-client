import got from 'got'
import decompress from 'decompress'
import getStream from 'get-stream'
import pEvent from 'p-event'

function normalize (repo: string) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/
  let match = regex.exec(repo)
  let checkout

  if (match) {
    let url = match[2]
    checkout = match[3] || 'master'

    return {
      type: 'direct',
      url: url,
      checkout: checkout
    }
  } else {
    // eslint-disable-next-line
    regex = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^\/]+)\/([^#]+)(?:#(.+))?$/
    match = regex.exec(repo)
    let type = (match as RegExpExecArray)[1] || 'github'
    let origin = (match as RegExpExecArray)[2] || null
    let owner = (match as RegExpExecArray)[3]
    let name = (match as RegExpExecArray)[4]
    checkout = (match as RegExpExecArray)[5] || 'master'

    if (origin == null) {
      if (type === 'github') {
        origin = 'github.com'
      } else if (type === 'gitlab') {
        origin = 'gitlab.com'
      } else if (type === 'bitbucket') {
        origin = 'bitbucket.org'
      }
    }

    return {
      type: type,
      origin: origin,
      owner: owner,
      name: name,
      checkout: checkout
    }
  }
}

function addProtocol (origin: string) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    origin = 'https://' + origin
  }

  return origin
}

function getUrl (repo: any) {
  let url

  let origin = addProtocol(repo.origin)
  // eslint-disable-next-line
  if (/^git\@/i.test(origin)) {
    origin = origin + ':'
  } else {
    origin = origin + '/'
  }

  if (repo.type === 'github') {
    url = origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip'
  } else if (repo.type === 'gitlab') {
    url = origin + repo.owner + '/' + repo.name + '/repository/archive.zip?ref=' + repo.checkout
  } else if (repo.type === 'bitbucket') {
    url = origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip'
  }
  return url
}

export default async (origin: string, dest: string, onProgress: (progress: Record<string, any>) => void) => {
  const repo = normalize(origin)
  const url = repo.url || getUrl(repo)
  // const zipName = join(dest, basename(url as string))
  const stream = got.stream(url as string, {
    headers: {
      accept: 'application/zip'
    },
    isStream: true,
    responseType: 'buffer'
  }).on('downloadProgress', onProgress)
  await pEvent(stream, 'response').then((res) => {
    return Promise.all([getStream.buffer(stream), res])
  }).then((result) => {
    const [data, _] = result
    return decompress(data, dest, {
      strip: 1
    })
  })
}
