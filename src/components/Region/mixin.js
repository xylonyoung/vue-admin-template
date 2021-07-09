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
        this.$emit('input', e[e.length - 1])
      } else {
        this.$emit('input', null)
      }
    },
    regionsChange(val) {
      const region = val[val.length - 1]
      // same value not to change
      if (region && !this.value?.some(e => e === region)) {
        const result = this.value ? [...this.value] : []
        result.push(region)
        this.$emit('input', result)
      }
    },
    regionRemove(region) {
      this.$emit(
        'input',
        this.value.filter(e => e !== region)
      )
    }
  }
}
