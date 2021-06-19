export default {
  props: {
    configs: { type: Array, required: true },
    props: { type: Object, default: () => ({}) },
    events: { type: Object, default: () => ({}) },
    entity: { type: Object, default: () => ({}) }
  },
  computed: {
    mixedProps() {
      return { ...this.defaultProps, ...this.props }
    }
  },
  methods: {
    propertyName(item) {
      return item?.property ?? item
    },
    getLabel(item) {
      const name = this.propertyName(item)
      return this.entity[name]?.translation ?? name
    },
    dataType(item, type) {
      const name = this.propertyName(item)
      return this.entity[name]?.metadata?.type === type
    },
    getString(row, item) {
      const result = row[this.propertyName(item)]
      return result?.__toString ?? result
    }
  }
}
