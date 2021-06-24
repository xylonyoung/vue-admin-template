import regionMixin from './mixin'

export default function(prop) {
  return {
    props: ['data'],
    render(h) {
      if (!this.loading && this.data?.[prop]?.length > 0) {
        return (
          <div>
            {this.data.map(e => {
              return <el-tag type='info'>{this.getRegionName(e)}</el-tag>
            })}
          </div>
        )
      }
    },
    ...regionMixin
  }
}
