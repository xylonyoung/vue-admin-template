export default class QueryData {
  constructor(queryData, querierConfig, componentData) {
    this.queryData = queryData
    this.querierConfig = querierConfig
    this.componentData = componentData
    this.typeFunc = {
      comparison: 'comparisonSearch',
      date: 'dateSearch',
      input: 'fuzzySearch',
      range: 'rangeSearch'
    }
  }

  dataProcess() {
    const result = []
    for (const key in this.queryData) {
      const value = this.queryData[key]
      if (value === undefined || value === '') continue

      const config = this.querierConfig.find(e => e.property === key)
      const { type, formatFunc } = config
      const aTempFunc = formatFunc
        ? this[formatFunc]
        : this[this.typeFunc[type]] ?? this.equalSearch

      result.push(aTempFunc.call(this, key, value, config))
    }

    for (const key in this.componentData) {
      if (this.componentData[key]) result.push(this.componentData[key])
    }

    return result.join(' && ') || ''
  }

  fuzzySearch(key, value) {
    return `${this.keyProcess(key)} matches '/${value}/'`
  }

  equalSearch(key, value) {
    return `${this.keyProcess(key)} == ${value}`
  }

  multiSearch(key, value) {
    return `${this.keyProcess(key)} in [${value}]`
  }

  comparisonSearch(key, value) {
    if (value[0] && value[1]) {
      return `${this.keyProcess(key)} ${value[1]} ${value[0]}`
    }
  }

  rangeSearch(key, value) {
    if (value[0] && value[1]) {
      return `${this.keyProcess(key)} >= '${value[0]} && ${this.keyProcess(
        key
      )} <= '${value[1]}`
    }
  }

  dateSearch(key, value, config) {
    if (!value) return

    if (config?.props?.['value-format']) {
      return `${this.keyProcess(key)} == ${value}`
    }

    let beginDate = value
    let endDate = value
    if (config?.props?.type === 'daterange') {
      beginDate = value[0]
      endDate = value[1]
    }
    return `${this.keyProcess(key)} >= datetime.get('${this.dateFormat(
      beginDate
    )}') && ${this.keyProcess(key)} <= datetime.get('${this.dateFormat(
      this.getTomorrow(endDate)
    )}')`
  }

  getTomorrow(date) {
    const today = new Date(date)
    return new Date(today.setDate(today.getDate() + 1))
  }

  dateFormat(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  keyProcess(key) {
    let result = 'entity'
    const keys = key.split('.')
    keys.forEach(e => {
      result += this.createKey(e)
    })
    return result
  }

  createKey(key) {
    if (/^__/.test(key)) return `.${key}()`
    return `.get${this.toUpperCase(key)}()`
  }

  toUpperCase(str) {
    if (str[0]) return str.replace(str[0], str[0].toUpperCase())
    return ''
  }
}
