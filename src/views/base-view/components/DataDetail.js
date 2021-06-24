import ImageRenderFunc from './ImageRender'

const ImageRender = ImageRenderFunc()
export default function(propsArr) {
  return {
    props: ['record', 'structure'],
    render(h) {
      return (
        <div>
          <el-button
            type='primary'
            size='mini'
            plain
            onClick={() => {
              this.dialogVisible = true
            }}
          >
            查看详情
          </el-button>
          <el-dialog
            title='详情'
            width='480px'
            visible={this.dialogVisible}
            on={{
              'update:visible': val => {
                this.dialogVisible = val
              }
            }}
          >
            <el-form label-width='100px' size='mini'>
              {propsArr.map(e => {
                return (
                  <el-form-item
                    label={this.structure?.[e.name]?.translation ?? e.label}
                  >
                    {e.type === 'image' ? (
                      <ImageRender data={this.record[e.name]}></ImageRender>
                    ) : (
                      <span>
                        {this.$getValue(
                          this.record,
                          e?.name?.__toString ?? e.name ?? e.label
                        )}
                      </span>
                    )}
                  </el-form-item>
                )
              })}
            </el-form>
          </el-dialog>
        </div>
      )
    },
    data() {
      return {
        dialogVisible: false
      }
    }
  }
}
