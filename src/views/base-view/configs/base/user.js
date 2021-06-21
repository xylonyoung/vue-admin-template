// import routes from '@/router/routes'
// const routeList = routes.map(e => ({ label: e.title, value: e.path }))
const roles = [
  { label: '管理员', value: 'ROLE_SUPER_ADMIN' },
  { label: '用户', value: 'ROLE_USER' }
]

const formConfig = [
  'username',
  'phone',
  { property: 'plainPassword', label: '密码' },
  {
    property: 'enabled',
    type: 'boolean',
    default: true,
    label: '是否启用'
  },
  // {
  //   property: 'permissions',
  //   default: [],
  //   label: '访问权限' },
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
    default: [],
    label: '用户权限',
    component: {
      props: ['data'],
      render(h) {
        if (!this.data?.roles) return
        return (
          <el-checkbox-group v-model={this.data.roles}>
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

  tableConfig: [
    'id',
    'username',
    // {
    //   property: 'permissions',
    //   label: '访问权限',
    //   component: {
    //     props: ['data'],
    //     render(h) {
    //       return (
    //         <div>
    //           {this.data?.permissions?.map(item => {
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
              {this.data?.roles?.map(item => {
                return (
                  <el-tag type='info'>
                    {roles.find(e => e.value === item)?.label}
                  </el-tag>
                )
              })}
            </div>
          )
        }
      }
    },
    { property: 'enabled', type: 'boolean', label: '是否启用' },
    'createdTime'
  ],

  formConfig: [...formConfig, 'email'],

  formConfigForCreate: [
    ...formConfig,
    {
      property: 'email',
      component: {
        props: ['data'],
        render(h) {
          return <div>{this.email}</div>
        },
        watch: {
          'data.username'(val) {
            if (val) {
              const result = `${val}@mail.com`
              this.data.email = result
              this.email = result
            }
          }
        },
        data() {
          return {
            email: ''
          }
        }
      }
    }
  ],

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
