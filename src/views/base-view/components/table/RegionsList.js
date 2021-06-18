import regionMixin from '../../mixins/region'

export default function() {
  return {
    props: ['data'],
    render(h) {
      if (!this.loading && this.data?.length > 0) {
        return (
          <div>
            {this.data.map(e => {
              return <div>{this.getRegionName(e)}</div>
            })}
          </div>
        )
      }
    },
    ...regionMixin
  }
}
