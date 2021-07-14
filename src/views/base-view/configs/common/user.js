import { ROLES_LIST, getConstantOptions } from '@/constants'

// import routes from '@/router/routes'
// const routeList = routes.map(e => ({ label: e.title, value: e.path }))

const formConfig = [
  'username',
  'plainPassword',
  {
    property: 'enabled',
    type: 'boolean',
    default: true
  },
  {
    property: 'roles',
    default: [],
    component: {
      props: ['value'],
      render(h) {
        return (
          <el-checkbox-group
            v-model={this.roles}
            onChange={val => {
              this.$emit('input', val)
            }}
          >
            {getConstantOptions(ROLES_LIST).map(item => {
              return <el-checkbox label={item.value}>{item.label}</el-checkbox>
            })}
          </el-checkbox-group>
        )
      },
      data() {
        return {
          roles: []
        }
      }
    }
  }
  // {
  //   property: 'permissions',
  //   default: [],
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
    {
      property: 'roles',
      component: {
        props: ['value'],
        render(h) {
          return (
            <div>
              {this.value?.map(e => {
                return <el-tag type='info'>{ROLES_LIST[e]}</el-tag>
              })}
            </div>
          )
        }
      }
    },
    { property: 'enabled', type: 'boolean' },
    'createdTime'
    // {
    //   property: 'permissions',
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
  ],

  formConfig: [...formConfig, 'email'],

  formConfigForCreate: [
    ...formConfig,
    {
      property: 'email',
      component: {
        props: ['value', 'form'],
        render(h) {
          return <div>{this.value}</div>
        },
        watch: {
          'form.username'(val) {
            if (val) {
              this.$emit('input', `${val}@mail.com`)
            } else {
              this.$emit('input', '')
            }
          }
        }
      }
    }
  ]

  // downloadConfig: {
  //   api: '/manage/users',
  //   filename: '用户',
  //   tHeader: ['Id', '用户名'],
  //   filterVal: ['id', 'username'],
  //   formatFunc(filterVal, jsonData) {
  //     return jsonData.map(v =>
  //       filterVal.map(j => {
  //         switch (j) {
  //           case 'username':
  //             return v?.profile?.__toString ?? v[j]
  //           default:
  //             return v[j]?.__toString ?? v[j]
  //         }
  //       })
  //     )
  //   }
  // }
}
