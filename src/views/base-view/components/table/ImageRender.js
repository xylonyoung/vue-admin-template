import { buildFullPath } from '@/utils/utils'

export default function(avatar) {
  return {
    props: ['data'],
    render(h) {
      return h('el-image', {
        style: {
          width: '80px',
          height: '80px',
          border: '3px white solid',
          boxShadow: '1px 1px 5px #ddd'
        },
        attrs: {
          src: this.buildPath(this.data),
          'preview-src-list': this.buildPathArray()
        }
      })
    },
    methods: {
      buildPath(pathData) {
        if (!pathData) return ''

        const result = pathData instanceof Array ? pathData[0] : pathData

        if (avatar) return result

        return buildFullPath(`/uploads/images/${result?.__toString ?? result}`)
      },
      buildPathArray() {
        if (!this.data) return []

        if (this.data instanceof Array) {
          return this.data.map(e => this.buildPath(e))
        }

        return [this.buildPath(this.data)]
      }
    }
  }
}
