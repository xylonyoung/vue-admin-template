export default function(param) {
  return {
    props: ['data', 'options', 'property'],
    render(h) {
      const property = param?.property ?? this.property
      return (
        <el-select
          v-model={this.data[property]}
          v-loading={!this.options[property]}
          props={{
            placeholder: '请选择',
            clearable: true,
            filterable: true,
            ...param?.props
          }}
        >
          {this.options[property]?.map(e => (
            <el-option label={e.label} value={e.value} />
          ))}
        </el-select>
      )
    }
  }
}
