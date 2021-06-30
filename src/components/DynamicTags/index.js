export default function(param) {
  return {
    props: ['data', 'property'],
    render(h) {
      this.property = param?.property ?? this.property
      return (
        <div>
          {this.inputVisible ? (
            <el-input
              style={{ width: '160px', marginRight: '10px' }}
              ref='saveTagInput'
              v-model={this.inputValue}
              size='small'
              nativeOn={{
                keyup: event => {
                  if (event.keyCode === 13) this.handleInputConfirm()
                }
              }}
              onBlur={this.handleInputConfirm}
            />
          ) : (
            <el-button
              style={{ marginRight: '10px' }}
              size='small'
              onClick={this.showInput}
            >
              + 添 加
            </el-button>
          )}
          {this.dynamicTags.map((tag, index) => (
            <el-tag
              style={{ marginRight: '10px' }}
              closable
              disable-transitions={false}
              onClose={() => {
                this.handleClose(index)
              }}
            >
              {tag}
            </el-tag>
          ))}
        </div>
      )
    },
    data() {
      return {
        dynamicTags: [],
        inputVisible: false,
        inputValue: ''
      }
    },
    watch: {
      dynamicTags(val) {
        this.data[this.property] = val
      }
    },
    created() {
      if (this.data[this.property]) {
        this.dynamicTags = [...this.data[this.property]]
      }
    },
    methods: {
      handleClose(index) {
        this.dynamicTags.splice(index, 1)
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      handleInputConfirm() {
        const inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      }
    }
  }
}
