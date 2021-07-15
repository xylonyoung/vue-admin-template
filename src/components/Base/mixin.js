export default {
  props: {
    config: { type: Array, default: () => [] },
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
    if (this.setConfig) {
      this.setConfig()
      this.getOptions()
    }
  },
  computed: {
    configProps() {
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
      return result?.__toString ?? result
    },
    imageUrl(images) {
      return this.imageList(images)[0]
    },
    imageList(images) {
      if (!images) return []

      if (Array.isArray(images)) {
        return images.map(e => this.$getImage(e))
      }

      return [this.$getImage(images)]
    }
  }
}
