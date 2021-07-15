export default function(options) {
  return {
    props: ['value'],
    render(h) {
      return (
        <el-checkbox-group
          v-model={this.checkedList}
          onChange={val => {
            this.$emit('input', val)
          }}
        >
          {options.map(item => {
            return <el-checkbox label={item.value}>{item.label}</el-checkbox>
          })}
        </el-checkbox-group>
      )
    },
    data() {
      return {
        checkedList: []
      }
    },
    watch: {
      value(val) {
        if (val?.length > 0) {
          this.checkedList = [...val]
        }
      }
    }
  }
}
