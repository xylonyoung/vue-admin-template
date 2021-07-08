export default function(list) {
  /**
   * @param {{label:String, prop:String}[]} list
   */
  return {
    props: ['row', 'property'],
    render(h) {
      return (
        <el-popover placement='left' width='600' trigger='click'>
          <el-table data={this.row[this.property]}>
            {list.map(e => {
              return (
                <el-table-column
                  label={e.label}
                  scopedSlots={{
                    default: ({ row }) => {
                      return <span>{this.$getValue(row, e.prop)}</span>
                    }
                  }}
                ></el-table-column>
              )
            })}
          </el-table>
          <el-button slot='reference' type='primary' size='mini' plain>
            点击查看
          </el-button>
        </el-popover>
      )
    }
  }
}
