export default function() {
  return {
    props: ['data'],
    render(h) {
      return (
        <div>
          <el-button
            size='small'
            type={this.btnColor}
            onClick={this.showDialog}
          >
            {this.btnName}
          </el-button>
        </div>
      )
    },
    computed: {
      reviewData() {
        return this.todoList.find(e => e.id === this.itemId) || {}
      },
      btnColor() {
        return this.reviewData.status === 'offer' ? 'danger' : 'primary'
      },
      btnName() {
        const status = this.reviewData.status || 'draft'
        switch (status) {
          case 'draft':
            return '提交'
          case 'offer':
            return '取消'
          default:
            return '审核'
        }
      }
    }
  }
}
