import { STAFF_STATUS, constantForSelect } from '../../constants'
import Select from '../../components/Select'
import querierConfigs from '../../utils/querier-configs'

export default {
  querierConfig: [
    {
      type: 'input',
      property: 'phone',
      props: { placeholder: '请输入电话号码' }
    },
    {
      type: 'input',
      property: 'name',
      props: { placeholder: '请输入员工名字' }
    },
    ...querierConfigs
  ],

  tableConfig: [
    'id',
    'department',
    'group',
    'balance',
    'name',
    'phone',
    { property: 'status', type: 'status', status: STAFF_STATUS },
    'user',
    {
      label: '解绑用户',
      component: {
        props: ['data', 'row', 'index'],
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
              .put(`/business/staffs/${this.row.id}`, { user: null })
              .then(res => {
                this.$set(this.data, this.index, res.data)
              })
          }
        }
      }
    }
  ],

  formConfig: [
    {
      property: 'department',
      component: businessSelect()
    },
    {
      property: 'group',
      component: businessSelect()
    },
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

function businessSelect() {
  return {
    props: ['data', 'property'],
    render(h) {
      return (
        <el-select
          v-model={this.data[this.property]}
          v-loading={this.loading}
          props={{
            placeholder: '请选择',
            clearable: true,
            filterable: true
          }}
        >
          {this.options?.map(e => (
            <el-option label={e.label} value={e.value} />
          ))}
        </el-select>
      )
    },
    data() {
      return {
        options: [],
        loading: true
      }
    },
    created() {
      this.$api.get('/business/businesses').then(res => {
        this.loading = false
        const property = this.property + 's'
        this.options = res?.data?.[property]?.map(e => ({
          label: e,
          value: e
        }))
      })
    }
  }
}
