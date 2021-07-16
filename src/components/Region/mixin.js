import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      region: [],
      loading: false,
      listLoading: false,
      regionNameList: [],
      toStop: false
    }
  },
  computed: {
    ...mapGetters(['regionList'])
  },
  beforeDestroy() {
    this.toStop = true
  },
  methods: {
    getRegionNameList() {
      if (this.value?.length > 0) {
        this.loading = true
        this.listLoading = true
      }

      this.value.forEach((e, index) => {
        this.getRegionName(e).then(res => {
          if (index === this.value.length - 1) this.loading = false

          this.listLoading = false
          this.regionNameList.push({ id: e, name: res })
        })
      })
    },
    async getRegionName(id) {
      if (this.toStop) return

      let region = this.regionList.find(e => e.id === id)
      if (!region) {
        region = await this.$store.dispatch('region/getRegion', id)
      }

      let result = region.name
      if (region.parent?.id) {
        result = (await this.getRegionName(region.parent.id)) + ',' + result
      }
      return result
    },
    // async getRegionList({ node, resolve }) {
    //   const { level, value } = node

    //   let res
    //   if (value) {
    //     res = await this.$api.get('/api/uni-regions', {
    //       params: { '@filter': 'entity.getParent().getId() == ' + value }
    //     })
    //   } else {
    //     res = await this.$api.get('/api/uni-regions', {
    //       params: { '@filter': 'entity.getParent() == null' }
    //     })
    //   }

    //   const result = res?.data.filter(checkout).map(e => ({
    //     leaf: level >= 2,
    //     value: e.id,
    //     label: e.name
    //   }))

    //   resolve(result)
    //   function checkout(item) {
    //     return value ? item.parent?.id === value : item.parent === null
    //   }
    // },
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
