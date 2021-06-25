export default function(property, optionProperty, props) {
  return {
    props: ['data', 'options'],
    render(h) {
      return (
        <el-select
          v-model={this.data[property]}
          v-loading={!this.options[optionProperty]}
          props={{
            placeholder: '请选择',
            clearable: true,
            filterable: true,
            ...props
          }}
        >
          {this.options[optionProperty]?.map(e => (
            <el-option label={e.label} value={e.value} />
          ))}
        </el-select>
      )
    }
  }
}
