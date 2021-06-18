import regionMixin from '../../mixins/region'

export function Region(props) {
  return {
    props: ['form', 'property'],
    render(h) {
      return (
        <div>
          <div>{this.getRegionName(this.form[this.property])}</div>
          <div v-loading={this.loading}>
            {this.loading || (
              <el-cascader
                style='width:60%'
                v-model={this.region}
                clearable
                on-change={this.regionChange}
                props={{
                  props: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                      this.$store.dispatch('region/getRegions', {
                        node,
                        resolve
                      })
                    },
                    ...props
                  }
                }}
              ></el-cascader>
            )}
          </div>
        </div>
      )
    },
    ...regionMixin
  }
}

export function Regions(props) {
  return {
    props: ['form', 'property'],
    render(h) {
      return (
        <div>
          <div v-loading={this.loading}>
            {this.loading || (
              <el-cascader
                style='width:60%'
                v-model={this.region}
                clearable
                on-change={this.regionsChange}
                props={{
                  props: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                      this.$store.dispatch('region/getRegions', {
                        node,
                        resolve
                      })
                    },
                    ...props
                  }
                }}
              ></el-cascader>
            )}
          </div>
          <div>
            {this.form[this.property]?.map((e, index) => {
              const style = index > 0 ? 'margin-left:8px' : ''
              return (
                <el-tag
                  style={style}
                  closable
                  on-close={() => {
                    this.form[this.property].splice(index, 1)
                  }}
                >
                  {this.getRegionName(e)}
                </el-tag>
              )
            })}
          </div>
        </div>
      )
    },
    ...regionMixin
  }
}

export function UploadRegion(props) {
  return {
    props: ['data'],
    render(h) {
      return (
        <div
          v-loading={this.loading}
          style='width:100%;display:flex;justify-content:center;margin-bottom:24px'
        >
          {this.loading || (
            <el-cascader
              style='width:60%'
              v-model={this.data.region}
              clearable
              on-change={this.regionChange}
              props={{
                props: {
                  lazy: true,
                  lazyLoad: (node, resolve) => {
                    this.$store.dispatch('region/getRegions', {
                      node,
                      resolve
                    })
                  },
                  ...props
                }
              }}
            ></el-cascader>
          )}
        </div>
      )
    },
    ...regionMixin,
    methods: {
      regionChange(e) {
        if (e.length > 0) {
          this.data.region = e[e.length - 1]
        } else {
          this.data.region = null
        }
      }
    }
  }
}
