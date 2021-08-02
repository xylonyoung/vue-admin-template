export default function() {
  return {
    props: ['value'],
    render(h) {
      return (
        <div
          style={{
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {this.imageUrl ? (
            <el-image
              style={{ width: '100%', height: '100%' }}
              src={this.imageUrl}
              preview-src-list={this.imageList}
            />
          ) : (
            <div>
              <i
                class='el-icon-document-delete'
                style={{ fontSize: '32px', color: '#bbb' }}
              />
              <div>没有图片</div>
            </div>
          )}
        </div>
      )
    },
    computed: {
      imageUrl() {
        return this.imageList[0]
      },
      imageList() {
        if (!this.value) return []

        if (Array.isArray(this.value)) {
          return this.value.map(e => this.$getImage(e))
        }

        return [this.$getImage(this.value)]
      }
    }
  }
}
