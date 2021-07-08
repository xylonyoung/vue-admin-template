import { STAFF_STATUS, constantForSelect } from '@/constants'
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
  ],

  downloadConfig: {
    api: '/business/staffs',
    filename: '员工',
    tHeader: ['ID', '部门', '组别', '资金', '名称', '电话', '状态', '用户'],
    filterVal: [
      'id',
      'department',
      'group',
      'balance',
      'name',
      'phone',
      'status',
      'user'
    ],
    formatFunc(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          switch (j) {
            case 'status':
              return STAFF_STATUS[v[j]]
            default:
              return v[j]?.__toString ?? v[j]
          }
        })
      )
    }
  },

  uploadValidator: {
    title: '导入员工',
    filename: '员工模板',
    fields: {
      id: 'ID',
      department: '部门',
      group: '组别',
      balance: '资金',
      name: '名称',
      phone: '电话',
      status: '状态',
      user: '用户'
    },
    rules: {
      id: [
        { type: 'number', message: 'ID必须为数字' },
        {
          validator: (rule, value, callback) => {
            if (value >= 0 && Number.isInteger(value)) {
              callback()
            } else {
              callback(new Error('ID必须为正整数'))
            }
          }
        }
      ],
      department: {
        validator(rule, value, callback) {
          if (this.departments.some(e => e === value) || !value) {
            callback()
          } else {
            callback(new Error('部门有错'))
          }
        }
      },
      group: {
        validator(rule, value, callback) {
          if (this.groups.some(e => e === value) || !value) {
            callback()
          } else {
            callback(new Error('组别有错'))
          }
        }
      },
      balance: [
        {
          validator: (rule, value, callback) => {
            if (value >= 0) {
              callback()
            } else {
              callback(new Error('资金必须为正数'))
            }
          }
        }
      ],
      name: [{ required: true, message: '名称必须填写' }]
    },
    createdFunc() {
      this.$api.get('/business/businesses').then(res => {
        const { data } = res
        this.rules.department.departments = data?.departments ?? []
        this.rules.group.groups = data?.groups ?? []
      })
    },
    uploadFunc(excelData) {
      return new Promise((resolve, reject) => {
        const waitPromise = []
        excelData.forEach(e => {
          const status = STAFF_STATUS.indexOf(e.status)
          const id = e.id
          const result = {}

          for (const key in e) {
            if (key === 'user' || key === 'id') continue

            if (key === 'status') {
              result[key] = status === -1 ? 0 : status
              continue
            }

            result[key] = e[key]
          }

          if (id) {
            waitPromise.push(this.$api.put(`/business/staffs/${id}`, result))
          } else {
            waitPromise.push(this.$api.post('/business/staffs', result))
          }
        })
        Promise.all(waitPromise)
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
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
