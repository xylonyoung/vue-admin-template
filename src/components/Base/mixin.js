export default {
  props: {
    config: { type: Array, required: true },
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
      return item.label ?? this.entity[name]?.translation ?? name
    },
    getEntityMetadata(item, property) {
      const name = this.propertyName(item)
      return this.entity[name]?.metadata?.[property]
    },
    dataType(item, type) {
      const name = this.propertyName(item)
      if (item.type) {
        return item.type === type
      } else {
        return this.entity[name]?.metadata?.type === type
      }
    }
  }
}
