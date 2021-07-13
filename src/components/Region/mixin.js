// import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      region: [],
      loading: false,
      regionNameList: [],
      isDestroy: false
    }
  },
  // computed: {
  //   ...mapGetters(['regionList'])
  // },
  // watch: {
  //   regionList: {
  //     handler(val) {
  //       if (val.length === 0) {
  //         this.$store.dispatch('region/getRegionList')
  //         return
  //       }
  //       this.loading = false
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  beforeDestroy() {
    this.isDestroy = true
  },
  methods: {
    getRegionNameList() {
      this.value.forEach(e => {
        this.getRegionName(e).then(res => {
          this.regionNameList.push(res)
        })
      })
    },
    async getRegionName(id) {
      if (this.isDestroy) return

      const res = await this.$api.get('/api/uni-regions/' + id)
      const region = res?.data
      let result = region.name

      if (region.parent?.id) {
        result = (await this.getRegionName(region.parent.id)) + ',' + result
      }
      return result
    },
    async getRegionList({ node, resolve }) {
      const { level, value } = node

      let res
      if (value) {
        res = await this.$api.get('/api/uni-regions', {
          params: { '@filter': 'entity.getParent().getId() == ' + value }
        })
      } else {
        res = await this.$api.get('/api/uni-regions', {
          params: { '@filter': 'entity.getParent() == null' }
        })
      }

      const result = res?.data.filter(checkout).map(e => ({
        leaf: level >= 2,
        value: e.id,
        label: e.name
      }))

      resolve(result)
      function checkout(item) {
        return value ? item.parent?.id === value : item.parent === null
      }
    },
    regionChange(e) {
      if (e.length > 0) {
        this.$emit('input', e[e.length - 1])
      } else {
        this.$emit('input', '')
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
