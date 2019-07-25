const downloadGitRepo = require('download-git-repo')
const updater = require('@suen/electron-updater')

function download (repo, dest) {
  return new Promise(function (resolve, reject) {
    downloadGitRepo(repo, dest, function (err) {
      if (err) reject(err)
      resolve()
    })
  })
}

module.exports = {
  download,
  updater
}
