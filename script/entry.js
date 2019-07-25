const { resolve } = require('./util')
const { scenePath } = require('./constant')
const { join } = require('path')
const fromPairs = require('lodash/fromPairs')

const entry = ['index']

module.exports = fromPairs(
  entry.map(key => {
    return [
      key,
      [
        join(scenePath, key, 'index.tsx'),
        join(scenePath, key, 'index.less')
      ]
    ]
  })
)
