import kebabCase from 'lodash.kebabcase'
import pluralize from 'pluralize'

export default function(entity) {
  let aEntity = {}
  aEntity.prefix = 'manage'

  if (typeof entity === 'string') {
    aEntity.name = parseEntityName(entity)
  } else {
    aEntity = { ...aEntity, ...entity }
    aEntity.name = parseEntityName(entity.name)
  }

  const result = [aEntity.prefix, aEntity.name, aEntity.suffix].filter(e => e)
  return result.join('/')

  function parseEntityName(name) {
    return kebabCase(pluralize(name))
  }
}
