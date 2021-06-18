import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      region: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters(['regionList'])
  },
  watch: {
    regionList: {
      handler(val) {
        if (val.length === 0) {
          this.$store.dispatch('region/getRegionList')
          return
        }
        this.loading = false
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getRegionName(id) {
      const region = this.regionList.find(e => e.id === id)
      if (!region) return

      let result = region.name
      if (region.parent?.id) {
        result = this.getRegionName(region.parent.id) + ',' + result
      }
      return result
    },
    regionChange(e) {
      if (e.length > 0) {
        this.form[this.property] = e[e.length - 1]
      } else {
        this.form[this.property] = null
      }
    },
    regionsChange(val) {
      // push the right value and form.regions don't have
      const value = val[val.length - 1]
      if (value && !this.form[this.property]?.some(e => e === value)) {
        this.form[this.property] ??= []
        this.form[this.property].push(value)
      }
    }
  }
}
