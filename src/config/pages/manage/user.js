import { ROLES_LIST, getConstantOptions } from '@/config/constants'
import Checkbox from '@/components/Base/Form/Checkbox'

// import routes from '@/router/routes'
// const routeList = routes.map(e => ({ label: e.title, value: e.path }))

const formConfig = [
  { property: 'username', label: '用户名' },
  { property: 'plainPassword', label: '密码' },
  {
    property: 'enabled',
    label: '启用',
    type: 'boolean',
    default: true
  },
  {
    property: 'roles',
    label: '角色',
    default: [],
    component: Checkbox(getConstantOptions(ROLES_LIST))
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

  tableQuery: {
    '@order': 'id|DESC',
    '@filter': 'entity.getWechatOpenId() == null'
  },

  tableConfig: [
    'id',
    { property: 'username', label: '用户名' },
    {
      property: 'roles',
      label: '角色',
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
    { property: 'enabled', label: '启用', type: 'boolean' },
    'createdTime'
  ],

  formConfig: [...formConfig, { property: 'email', label: '邮箱' }],

  formConfigForCreate: [
    ...formConfig,
    {
      property: 'email',
      label: '邮箱',
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
