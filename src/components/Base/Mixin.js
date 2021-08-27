export default {
  props: {
    config: { type: Array, default: () => [] },
    props: { type: Object, default: () => ({}) },
    events: { type: Object, default: () => ({}) },
    entity: { type: [Object, String], required: true }
  },
  data() {
    return {
      anEntity: {},
      showComponent: false
    }
  },
  async created() {
    this.anEntity = await this.$store.dispatch('entity/getEntity', this.entity)
    if (this.setConfig) {
      this.setConfig()
      this.getOptions()
    }
    this.resetComponent()
  },
  computed: {
    configProps() {
      return { ...this.defaultProps, ...this.props }
    }
  },
  methods: {
    resetComponent() {
      // reset component
      this.showComponent = false
      this.$nextTick(() => {
        this.showComponent = true
      })
    },
    propertyName(item) {
      return item?.property ?? item
    },
    getLabel(item) {
      const name = this.propertyName(item)
      return item.label ?? this.anEntity[name]?.translation ?? name
    },
    getEntityMetadata(item, property) {
      const name = this.propertyName(item)
      return this.anEntity[name]?.metadata?.[property]
    },
    checkDataType(item, type) {
      const name = this.propertyName(item)
      if (item.type) {
        return item.type === type
      } else {
        return this.anEntity[name]?.metadata?.type === type
      }
    },
    getString(row, item) {
      const result = row[this.propertyName(item)]

      if (typeof result === 'object') {
        return result?.__toString ?? ''
      }

      return result
    }
  }
}
