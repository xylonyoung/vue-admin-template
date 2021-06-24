import kebabCase from 'lodash.kebabcase'
import pluralize from 'pluralize'

export default function(entity) {
  let anEntity = {}
  anEntity.prefix = 'manage'

  if (typeof entity === 'string') {
    anEntity.name = parseEntityName(entity)
  } else {
    anEntity = { ...anEntity, ...entity }
    anEntity.name = parseEntityName(entity.name)
  }

  const result = [anEntity.prefix, anEntity.name, anEntity.suffix].filter(
    e => e
  )
  return result.join('/')

  function parseEntityName(name) {
    // fix staff plural is staffs
    const result = /staff$/i.test(name) ? name + 's' : pluralize(name)
    return kebabCase(result)
  }
}
