import kebabCase from 'lodash.kebabcase'
import pluralize from 'pluralize'
import { roles } from '@/config/settings'
import { getRole } from '@/utils/auth'

export function buildEntityPath(entity) {
  // set default prefix
  let anEntity = {}

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

export function dynamicPath(path) {
  const role = roles.find(e => e.value === getRole())
  return buildEntityPath({ prefix: role.value, name: path })
}
