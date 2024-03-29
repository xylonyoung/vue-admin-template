import BaseMixin from '@/components/Base/Mixin'
import ImageRender from '@/components/ImageRender'

const imageRender = ImageRender()

export default function(config, btnName) {
  return {
    mixins: [BaseMixin],
    props: ['row', 'entity'],
    render(h) {
      return (
        <div>
          <el-button
            size='small'
            onClick={() => {
              this.dialogVisible = true
            }}
          >
            {btnName || '详情'}
          </el-button>
          <el-dialog
            title='查看详情'
            append-to-body
            visible={this.dialogVisible}
            on={{
              'update:visible': val => {
                this.dialogVisible = val
              }
            }}
            width='800px'
          >
            {config.map(item => {
              return (
                <div
                  style={{
                    padding: '12px 24px',
                    display: 'flex',
                    fontSize: '16px'
                  }}
                >
                  <div
                    style={{
                      minWidth: '160px',
                      textAlign: 'right',
                      fontWeight: 'bold'
                    }}
                  >
                    {this.getLabel(item)}：
                  </div>
                  <div>
                    {(() => {
                      const ItemComponent = item.component
                      if (ItemComponent) {
                        return (
                          <ItemComponent
                            v-model={this.row[this.propertyName(item)]}
                          />
                        )
                      } else {
                        const type = this.getDataType(item)
                        switch (type) {
                          case 'constant':
                            return this.getConstant(this.row, item)
                          case 'image':
                            return (
                              <imageRender
                                v-model={this.row[this.propertyName(item)]}
                              />
                            )
                          case 'array':
                            return this.row[
                              this.propertyName(item)
                            ]?.map(arrayItem => (
                              <el-tag type='info'>{arrayItem}</el-tag>
                            ))
                          case 'boolean':
                            return this.row[this.propertyName(item)] ? (
                              <el-tag type='success'>是</el-tag>
                            ) : (
                              <el-tag type='danger'>否</el-tag>
                            )
                          case 'time':
                            return this.$dateFormat(
                              this.getString(this.row, item),
                              'H:m'
                            )
                          case 'date':
                            return this.$dateFormat(
                              this.getString(this.row, item),
                              'YYYY/M/D'
                            )
                          case 'datetime':
                            return this.$dateFormat(
                              this.getString(this.row, item)
                            )
                          default:
                            return this.getString(this.row, item)
                        }
                      }
                    })()}
                  </div>
                </div>
              )
            })}
          </el-dialog>
        </div>
      )
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    methods: {
      getDataType(item) {
        const name = this.propertyName(item)
        if (item.type) {
          return item.type
        } else {
          return this.anEntity[name]?.metadata?.type
        }
      }
    }
  }
}
