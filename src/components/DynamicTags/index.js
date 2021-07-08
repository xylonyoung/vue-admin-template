export default function() {
  return {
    props: ['value'],
    render(h) {
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
    created() {
      if (this.value) {
        this.dynamicTags = [...this.value]
      }
    },
    methods: {
      updateValue() {
        this.$emit('input', this.dynamicTags)
      },
      handleClose(index) {
        this.dynamicTags.splice(index, 1)
        this.updateValue()
      },
      handleInputConfirm() {
        const inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
          this.updateValue()
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      showInput() {
        this.inputVisible = true
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      }
    }
  }
}
