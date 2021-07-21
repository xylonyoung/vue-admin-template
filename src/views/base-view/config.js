import { roles } from '@/config/settings'

// https://webpack.js.org/guides/dependency-management/#requirecontext
const files = require.context('@/config/pages', true, /\.js$/)

const config = {}

files.keys().forEach(key => (config[keyFormat(key)] = files(key).default))

function keyFormat(key) {
  let result = key.match(/[^/]+(?=\.js)/)[0]
  // file name merges with folder name.
  roles.forEach(e => {
    const regex = new RegExp(`${e.value}/`)
    if (regex.test(key)) {
      result = `${e.value}-` + result
    }
  })

  return result
}

export default config
