import $api from '@/utils/request'
import kebabCase from 'lodash.kebabcase'
import pluralize from 'pluralize'

export default class EntityMethods {
  constructor(entity) {
    this.aEntity = {}
    this.aEntity.prefix = 'manage'

    if (typeof entity === 'string') {
      this.aEntity.name = this.parseEntityName(entity)
    } else {
      this.aEntity = { ...this.aEntity, ...entity }
      this.aEntity.name = this.parseEntityName(entity.name)
    }

    this.aEntity.path = this.buildPath()
    this.buildMethods()
  }

  parseEntityName(name) {
    return kebabCase(pluralize(name))
  }

  buildPath() {
    const result = [
      this.aEntity.prefix,
      this.aEntity.name,
      this.aEntity.suffix
    ].filter(e => e)

    return result.join('/')
  }

  buildMethods() {
    const methods = ['post', 'delete', 'put', 'get']
    methods.forEach(e => {
      this[e] = (...args) => {
        let url = this.aEntity.path
        let data
        if (typeof args[0] === 'number') {
          url += `/${args[0]}`
          data = args[1]
        } else {
          data = args[1]
        }

        return $api({ method: e, url, data })
      }
    })
  }
}
