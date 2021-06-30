export default function(param) {
  return {
    props: ['data', 'options', 'property'],
    render(h) {
      this.property = param?.property ?? this.property
      return (
        <el-select
          v-model={this.data[this.property]}
          v-loading={!this.options[this.property]}
          props={{
            placeholder: '请选择',
            clearable: true,
            filterable: true,
            ...param?.props
          }}
        >
          {this.options[this.property]?.map(e => (
            <el-option label={e.label} value={e.value} />
          ))}
        </el-select>
      )
    }
  }
}
