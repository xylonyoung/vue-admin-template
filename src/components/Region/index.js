import Mixin from './Mixin'

export function RegionList() {
  return {
    mixins: [Mixin],
    props: ['value'],
    render(h) {
      return (
        <div v-loading={this.loading} style='min-height:40px'>
          {this.regionNameList.map(e => {
            return <div>{e}</div>
          })}
        </div>
      )
    },
    created() {
      this.getRegionNameList()
    }
  }
}

export function Region(props) {
  return {
    mixins: [Mixin],
    props: ['value'],
    render(h) {
      return (
        <div>
          <div v-loading={this.loading}>
            {this.loading || (
              <el-cascader
                style='width:340px'
                v-model={this.region}
                clearable
                onChange={this.regionChange}
                props={{
                  props: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                      this.getRegionList({
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
    }
  }
}

export function Regions(props) {
  return {
    mixins: [Mixin],
    props: ['value'],
    render(h) {
      return (
        <div>
          <div v-loading={this.loading}>
            {this.loading || (
              <el-cascader
                style='width:60%'
                v-model={this.region}
                clearable
                onChange={this.regionsChange}
                props={{
                  props: {
                    lazy: true,
                    lazyLoad: (node, resolve) => {
                      this.getRegionList({
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
            {this.value?.map((e, index) => {
              const style = index > 0 ? 'margin-left:8px' : ''
              return (
                <el-tag
                  style={style}
                  closable
                  onClose={() => {
                    this.regionRemove(e)
                  }}
                >
                  {this.getRegionName(e)}
                </el-tag>
              )
            })}
          </div>
        </div>
      )
    }
  }
}

export function RegionUpload(props) {
  return {
    mixins: [Mixin],
    props: ['value'],
    render(h) {
      return (
        <div
          v-loading={this.loading}
          style='width:100%;display:flex;justify-content:center;margin-bottom:24px'
        >
          {this.loading || (
            <el-cascader
              style='width:60%'
              v-model={this.value.region}
              clearable
              onChange={val => {
                if (val.length > 0) {
                  this.value.region = val[val.length - 1]
                } else {
                  this.value.region = null
                }
              }}
              props={{
                props: {
                  lazy: true,
                  lazyLoad: (node, resolve) => {
                    this.getRegionList({
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
    }
  }
}
