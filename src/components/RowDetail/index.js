export default function(config) {
  return {
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
            详情
          </el-button>
          <el-dialog
            title='查看'
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
                      minWidth: '100px',
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
                          case 'image':
                            return (
                              <el-image
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  border: '3px white solid',
                                  boxshadow: '1px 1px 5px #ccc'
                                }}
                                src={this.imageUrl(this.getFormItem(item))}
                                preview-src-list={this.imageList(
                                  this.getFormItem(item)
                                )}
                              />
                            )
                          case 'array':
                            return this.getFormItem(item).map(arrayItem => (
                              <el-tag type='info'>{arrayItem}</el-tag>
                            ))
                          case 'boolean':
                            return this.getFormItem(item) ? (
                              <el-tag type='success'>是</el-tag>
                            ) : (
                              <el-tag type='danger'>否</el-tag>
                            )
                          case 'time':
                            return this.$dateFormat(this.getString(item), 'H:m')
                          case 'date':
                            return this.$dateFormat(
                              this.getString(item),
                              'YYYY/M/D'
                            )
                          case 'datetime':
                            return this.$dateFormat(this.getString(item))
                          default:
                            return this.getString(item)
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
        dialogVisible: false,
        anEntity: {}
      }
    },
    async created() {
      this.anEntity = await this.$store.dispatch(
        'entity/getEntity',
        this.entity
      )
    },
    methods: {
      propertyName(item) {
        return item?.property ?? item
      },
      getFormItem(item) {
        return this.row[this.propertyName(item)]
      },
      getLabel(item) {
        const name = this.propertyName(item)
        return item.label ?? this.anEntity[name]?.translation ?? name
      },
      getDataType(item) {
        const name = this.propertyName(item)
        if (item.type) {
          return item.type
        } else {
          return this.anEntity[name]?.metadata?.type
        }
      },
      getString(item) {
        const result = this.getFormItem(item)
        return result?.__toString ?? result
      },
      imageUrl(images) {
        if (!images) return

        const result = Array.isArray(images) ? images[0] : images
        return this.$getImage(result)
      },
      imageList(images) {
        if (!images) return

        if (Array.isArray(images)) {
          return images.map(e => this.$getImage(e))
        }

        return [this.$getImage(images)]
      }
    }
  }
}
