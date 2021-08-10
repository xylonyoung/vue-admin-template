import { mapGetters } from 'vuex'

export default {
  props: ['row', 'path'],
  render(h) {
    return (
      <div>
        <el-button
          size='small'
          type='primary'
          onClick={() => {
            this.dialogVisible = true
          }}
        >
          审核
        </el-button>

        <el-dialog
          title='审核'
          on={{
            'update:visible': val => {
              this.dialogVisible = val
            }
          }}
          visible={this.dialogVisible}
          appendToBody={true}
          width='800px'
        >
          <el-collapse>
            <el-collapse-item title='查看历史记录' name='history'>
              <el-timeline>
                {this.row.transitionContexts.map(e => (
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
            </el-collapse-item>
          </el-collapse>

          <div class='step-form'>
            <el-input
              v-model={this.reason}
              type='textarea'
              rows='2'
              placeholder='请输入理由'
            />
            <div>
              {this.row.transitionContexts.map(e => (
                <el-button
                  size='small'
                  type='primary'
                  onClick={() => {
                    this.transitionConfirm(e.name)
                  }}
                >
                  {e.name}
                </el-button>
              ))}
            </div>
          </div>
        </el-dialog>
      </div>
    )
  },
  data() {
    return {
      dialogVisible: false,
      reason: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
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
    },
    async transitionConfirm(transition) {
      const data = {
        context: JSON.stringify({
          reason: this.reason,
          user: this.user.username,
          transition: transition
        })
      }
      await this.$request.post(
        `${this.path.replace(/todo/, this.row.id)}/do/${transition}`,
        data
      )
      this.$emit('confirm')
      this.$message({ message: '成功', type: 'success' })
    }
  }
}
