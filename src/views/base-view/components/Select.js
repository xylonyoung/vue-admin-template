export default function(param) {
  /**
   * @param {Object} param
   * @param {string} param.property - formData property
   * @param {Object} param.props - https://element.eleme.cn/#/zh-CN/component/select#select-attributes
   */
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
