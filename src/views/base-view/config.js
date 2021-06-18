// https://webpack.js.org/guides/dependency-management/#requirecontext
const files = require.context('./configs', true, /\.js$/)

const config = {}

files.keys().forEach(key => (config[keyFormat(key)] = files(key).default))

function keyFormat(key) {
  return key.match(/[^/]+(?=\.js)/)[0]
}

export default config
