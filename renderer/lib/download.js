const download = require('download')

function normalize (repo) {
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
    let type = match[1] || 'github'
    let origin = match[2] || null
    let owner = match[3]
    let name = match[4]
    checkout = match[5] || 'master'

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

function addProtocol (origin) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    origin = 'https://' + origin
  }

  return origin
}

function getUrl (repo) {
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

export default (repo, dest) => {
  let options = {
    extract: true,
    strip: 1,
    mode: '666',
    headers: {
      accept: 'application/zip'
    },
    stream: true
  }
  repo = normalize(repo)
  const url = repo.url || getUrl(repo)
  return download(url, dest, options)
}
