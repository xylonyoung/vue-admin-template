import { STAFF_STATUS, constantForSelect } from '../../constants'
import Select from '../../components/Select'

export default {
  tableConfig: [
    'id',
    'balance',
    'name',
    'phone',
    { property: 'status', type: 'status', status: STAFF_STATUS },
    'user',
    {
      label: '解绑用户',
      component: {
        props: ['tableData', 'data', 'index'],
        render(h) {
          return (
            <el-popconfirm
              confirm-button-text='确认'
              cancel-button-text='取消'
              icon='el-icon-info'
              icon-color='red'
              title='确定解绑用户吗？'
              onOnConfirm={this.unbindUser}
            >
              <el-button slot='reference' type='danger' size='mini'>
                解绑用户
              </el-button>
            </el-popconfirm>
          )
        },
        methods: {
          unbindUser() {
            this.$api
              .put(`/business/staffs/${this.data.id}`, { user: null })
              .then(res => {
                this.$set(this.tableData, this.index, res.data)
              })
          }
        }
      }
    }
  ],

  formConfig: [
    'balance',
    'name',
    'phone',
    {
      property: 'status',
      options: constantForSelect(STAFF_STATUS),
      component: Select()
    }
  ]
}
