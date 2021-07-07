export default function(param) {
  return {
    props: ['formData', 'options', 'property'],
    render(h) {
      const property = param?.property ?? this.property
      return (
        <el-select
          v-model={this.formData[property]}
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
