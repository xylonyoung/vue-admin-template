import routes from '@/router/routes'
const routeList = routes.map(e => ({ label: e.title, value: e.path }))
const roles = [
  { label: '管理员', value: 'ROLE_SUPER_ADMIN' },
  { label: '用户', value: 'ROLE_USER' }
]

const formConfigs = [
  { property: 'username', field_options: { label: '用户名' }},
  'phone',
  { property: 'email', field_options: { label: 'Email' }},
  {
    property: 'enabled',
    type: 'boolean',
    default_value: true,
    field_options: { label: '是否启用' }
  },
  { property: 'plainPassword', field_options: { label: '密码' }},
  // {
  //   property: 'permissions',
  //   default_value: [],
  //   field_options: { label: '访问权限' },
  //   component: {
  //     props: ['form'],
  //     render(h) {
  //       if (!this.form.permissions) return
  //       return (
  //         <el-checkbox-group v-model={this.form.permissions}>
  //           {routeList.map(item => {
  //             return <el-checkbox label={item.value}>{item.label}</el-checkbox>
  //           })}
  //         </el-checkbox-group>
  //       )
  //     }
  //   }
  // },
  {
    property: 'roles',
    default_value: [],
    field_options: { label: '用户权限' },
    component: {
      props: ['form'],
      render(h) {
        if (!this.form.roles) return
        return (
          <el-checkbox-group v-model={this.form.roles}>
            {roles.map(item => {
              return <el-checkbox label={item.value}>{item.label}</el-checkbox>
            })}
          </el-checkbox-group>
        )
      }
    }
  }
]

export default {
  disableActions: ['delete'],

  querierConfig: [
    {
      type: 'input',
      property: 'username',
      props: { placeholder: '请输入户名' }
    }
  ],

  listQuery: {
    '@order': 'id|DESC',
    '@filter': 'entity.getWechatOpenId() == null'
  },

  tableConfigs: [
    'id',
    { property: 'username', label: '用户名' },
    // {
    //   property: 'permissions',
    //   label: '访问权限',
    //   component: {
    //     props: ['data'],
    //     render(h) {
    //       return (
    //         <div>
    //           {this.data.map(item => {
    //             return <div>{routeList.find(e => e.value === item)?.label}</div>
    //           })}
    //         </div>
    //       )
    //     }
    //   }
    // },
    {
      property: 'roles',
      label: '用户权限',
      component: {
        props: ['data'],
        render(h) {
          return (
            <div>
              {this.data.map(item => {
                return <div>{roles.find(e => e.value === item)?.label}</div>
              })}
            </div>
          )
        }
      }
    },
    { property: 'enabled', type: 'boolean', label: '是否启用' },
    'createdTime'
  ],

  formConfigs,

  // formConfigsForCreate: [
  //   { property: 'username', field_options: { label: '用户名' } },
  //   {
  //     property: 'email',
  //     component: {
  //       props: ['form'],
  //       render(h) {
  //         return <div>{this.form.email}</div>
  //       },
  //       watch: {
  //         'form.username'(val) {
  //           if (val) this.form.email = `${val}@mail.com`
  //         }
  //       }
  //     }
  //   },
  //   'phone',
  //   ...formConfigs
  // ],

  downloadConfig: {
    api: '/manage/users',
    filename: '用户',
    tHeader: ['Id', '用户名'],
    filterVal: ['id', 'username'],
    formatFunc(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          switch (j) {
            case 'username':
              return v?.profile?.__toString ?? v[j]
            default:
              return v[j]?.__toString ?? v[j]
          }
        })
      )
    }
  }
}
