export default function(property) {
  return {
    props: ['data'],
    render(h) {
      if (this.data?.[property]?.length < 1) return
      return (
        <el-popover placement='left' width='300' trigger='click'>
          <el-timeline>
            {this.data[property].map(e => (
              <el-timeline-item
                timestamp={this.$dateFormat(e.time)}
                placement='top'
              >
                <div>
                  <div>{this.parseContext(e.context, 'user')}</div>
                  <div>{this.parseContext(e.context, 'transition')}</div>
                  <div>{this.parseContext(e.context, 'reason')}</div>
                </div>
              </el-timeline-item>
            ))}
          </el-timeline>

          <el-button slot='reference' size='mini'>
            查看
          </el-button>
        </el-popover>
      )
    },
    methods: {
      parseContext(text, type) {
        if (text) {
          const textData = JSON.parse(text)
          switch (type) {
            case 'transition':
              return `流程：${textData[type]}`
            case 'reason':
              return `理由：${textData[type]}`
            case 'user':
              return `用户：${textData[type]}`
            default:
              return ''
          }
        } else {
          return ''
        }
      }
    }
  }
}
