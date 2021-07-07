export default {
  props: {
    config: { type: Array, required: true },
    props: { type: Object, default: () => ({}) },
    events: { type: Object, default: () => ({}) },
    entity: { type: [Object, String], required: true }
  },
  data() {
    return {
      anEntity: {}
    }
  },
  async created() {
    this.anEntity = await this.$store.dispatch('entity/getEntity', this.entity)

    if (this.formData) {
      this.setConfig()
      this.getOptions()
    }
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
      return item.label ?? this.anEntity[name]?.translation ?? name
    },
    getEntityMetadata(item, property) {
      const name = this.propertyName(item)
      return this.anEntity[name]?.metadata?.[property]
    },
    dataType(item, type) {
      const name = this.propertyName(item)
      if (item.type) {
        return item.type === type
      } else {
        return this.anEntity[name]?.metadata?.type === type
      }
    }
  }
}
