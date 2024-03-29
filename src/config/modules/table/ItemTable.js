export default function(list, btnName) {
  /**
   * @param {{label:String, prop:String}[]} list
   */
  return {
    props: ['value'],
    render(h) {
      return (
        <el-popover placement='left' width='600' trigger='click'>
          <el-table data={this.value}>
            {list.map(e => {
              return (
                <el-table-column
                  label={e.label}
                  scopedSlots={{
                    default: ({ row }) => {
                      return <span>{row[e.prop]}</span>
                    }
                  }}
                ></el-table-column>
              )
            })}
          </el-table>
          <el-button slot='reference' type='primary' size='small' plain>
            {btnName || '查看'}
          </el-button>
        </el-popover>
      )
    }
  }
}
